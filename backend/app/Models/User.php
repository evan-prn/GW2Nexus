<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Database\Factories\UserFactory;

/**
 * Modèle principal représentant un utilisateur de GW2Nexus.
 *
 * Responsabilités :
 *   - Authentification via Laravel Sanctum (token Bearer)
 *   - Stockage sécurisé de la clé API GW2 (chiffrement AES-256)
 *   - Gestion des rôles : user | moderateur | admin
 *   - Soft delete pour conserver les discussions/commentaires après suppression
 *   - Relations vers toutes les entités liées (profil, bans, discussions, etc.)
 *
 * @property int                 $id
 * @property string              $nom
 * @property string              $email
 * @property string              $password             Hash bcrypt géré par le cast 'hashed'
 * @property string|null         $pseudo_gw2
 * @property string|null         $avatar
 * @property string              $role                 'user' | 'moderateur' | 'admin'
 * @property string|null         $api_key              Clé API GW2 — chiffrée AES-256 en base, déchiffrée à la lecture
 * @property \Carbon\Carbon|null $email_verified_at
 * @property \Carbon\Carbon      $created_at
 * @property \Carbon\Carbon      $updated_at
 * @property \Carbon\Carbon|null $deleted_at           Null = compte actif (soft delete)
 */
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    // -------------------------------------------------------------------------
    // Configuration Eloquent
    // -------------------------------------------------------------------------

    /**
     * Attributs assignables en masse.
     *
     * Les autres attributs (role, email_verified_at, etc.) sont modifiés
     * uniquement via des méthodes dédiées pour éviter les mass assignment.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nom',
        'email',
        'password',
        'pseudo_gw2',
        'avatar',
        'role',
        'api_key',
    ];

    /**
     * Attributs masqués lors de la sérialisation JSON.
     *
     * Ces champs ne doivent JAMAIS apparaître dans les réponses API,
     * même en cas d'exposition accidentelle via toArray() ou toJson().
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'api_key', // Exposé uniquement via le helper hasApiKey() — jamais en clair
    ];

    /**
     * Casts — typage automatique et chiffrement transparent.
     *
     * - 'hashed'    : bcrypt automatique à l'assignation de password
     * - 'encrypted' : chiffrement AES-256 à l'écriture, déchiffrement à la lecture
     * - 'datetime'  : conversion Carbon automatique
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'api_key' => 'encrypted',
        ];
    }

    // -------------------------------------------------------------------------
    // Helpers — Rôles
    // -------------------------------------------------------------------------

    /**
     * Vérifie si l'utilisateur possède exactement le rôle donné.
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Vérifie si l'utilisateur est administrateur.
     * Les admins ont accès à toutes les actions du back-office.
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Vérifie si l'utilisateur est modérateur ou administrateur.
     * Les modérateurs peuvent lire les données admin mais pas appliquer des bans.
     */
    public function isModerator(): bool
    {
        return in_array($this->role, ['moderateur', 'admin'], true);
    }

    // -------------------------------------------------------------------------
    // Helpers — Clé API GW2
    // -------------------------------------------------------------------------

    /**
     * Indique si une clé API GW2 est configurée sur ce compte.
     *
     * Utiliser cette méthode plutôt que d'accéder à $this->api_key directement —
     * elle évite d'exposer accidentellement la valeur déchiffrée.
     */
    public function hasApiKey(): bool
    {
        return !empty($this->api_key);
    }

    // -------------------------------------------------------------------------
    // Helpers — Ban
    // -------------------------------------------------------------------------

    /**
     * Vérifie si l'utilisateur est actuellement banni.
     *
     * Effectue une requête SQL légère via le scope 'active' de UserBan.
     * Utilisé dans BanCheck middleware et AdminUserResource.
     *
     * Note : préférer eager-loader 'activeBan' si on a déjà l'objet en mémoire
     * pour éviter les requêtes N+1 dans les listes.
     */
    public function isBanned(): bool
    {
        return $this->bans()->active()->exists();
    }

    // -------------------------------------------------------------------------
    // Relations Eloquent
    // -------------------------------------------------------------------------

    /**
     * Profil GW2 lié à l'utilisateur (relation 1-1).
     *
     * Contient : nom_compte, monde, personnages (JSON), derniere_synchro, valide.
     * Créé automatiquement lors de la première synchronisation API GW2.
     */
    public function profilGw2(): HasOne
    {
        return $this->hasOne(ProfilGw2::class, 'user_id');
    }

    /**
     * Historique complet des sanctions appliquées à l'utilisateur (1-N).
     *
     * Inclut les bans actifs, expirés et levés.
     * Utiliser le scope ->active() pour ne récupérer que le ban courant.
     */
    public function bans(): HasMany
    {
        return $this->hasMany(UserBan::class, 'user_id');
    }

    /**
     * Ban actuellement actif (relation 1-1 dérivée de bans).
     *
     * Retourne null si l'utilisateur n'est pas banni.
     * Conçu pour être eager-loadé dans les listes admin :
     *   User::with('activeBan')->paginate()
     */
    public function activeBan(): HasOne
    {
        return $this->hasOne(UserBan::class, 'user_id')
            ->whereNull('lifted_at')
            ->where(function ($q): void {
                $q->where('type', 'permanent')
                    ->orWhere('expires_at', '>', now());
            })
            ->latestOfMany('id'); // MAX(id) — compatible only_full_group_by
    }

    /**
     * Discussions rédigées par l'utilisateur (1-N).
     *
     * user_id peut être null sur discussions si le compte est supprimé (SET NULL).
     */
    public function discussions(): HasMany
    {
        return $this->hasMany(Discussion::class, 'user_id');
    }

    /**
     * Commentaires de forum écrits par l'utilisateur (1-N).
     *
     * user_id peut être null sur commentaires si le compte est supprimé (SET NULL).
     */
    public function commentaires(): HasMany
    {
        return $this->hasMany(Commentaire::class, 'user_id');
    }

    /**
     * Builds créés par l'utilisateur (1-N).
     *
     * user_id peut être null sur builds si le compte est supprimé (SET NULL).
     */
    public function builds(): HasMany
    {
        return $this->hasMany(Build::class, 'user_id');
    }

    /**
     * Commentaires sur les builds écrits par l'utilisateur (1-N).
     */
    public function commentairesBuild(): HasMany
    {
        return $this->hasMany(CommentaireBuild::class, 'user_id');
    }

    /**
     * Adhésions aux guildes de l'utilisateur (table pivot étendue membres_guilde).
     *
     * Passe par MembreGuilde plutôt qu'un belongsToMany standard car la table
     * pivot contient des colonnes additionnelles (role, inviteur_id, rejoint_le).
     */
    public function membresGuilde(): HasMany
    {
        return $this->hasMany(MembreGuilde::class, 'user_id');
    }
}