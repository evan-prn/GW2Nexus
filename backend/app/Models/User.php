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
 * @property int         $id
 * @property string      $nom
 * @property string      $email
 * @property string      $password
 * @property string|null $pseudo_gw2
 * @property string|null $avatar
 * @property string      $role           user | moderateur | admin
 * @property string|null $api_key        Clé API GW2 — chiffrée AES-256 en base
 * @property \Carbon\Carbon|null $email_verified_at
 * @property \Carbon\Carbon      $created_at
 * @property \Carbon\Carbon      $updated_at
 * @property \Carbon\Carbon|null $deleted_at
 */
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * Attributs assignables en masse.
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
     * Attributs masqués lors de la sérialisation (réponses API).
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'api_key', // Ne jamais exposer la clé API GW2 dans les réponses JSON
    ];

    /**
     * Casts — typage automatique et chiffrement de la clé API.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'api_key'           => 'encrypted', // Chiffrement AES-256 transparent via Laravel
        ];
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Vérifie si l'utilisateur possède un rôle donné.
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Vérifie si l'utilisateur est administrateur.
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Vérifie si l'utilisateur est modérateur ou admin.
     */
    public function isModerator(): bool
    {
        return in_array($this->role, ['moderateur', 'admin'], true);
    }

    /**
     * Indique si une clé API GW2 est configurée sur ce compte.
     */
    public function hasApiKey(): bool
    {
        return ! empty($this->api_key);
    }

    // -------------------------------------------------------------------------
    // Relations Eloquent (alignées sur le MLD)
    // -------------------------------------------------------------------------

    /**
     * Profil GW2 lié à l'utilisateur (1-1).
     */
    public function profilGw2(): HasOne
    {
        return $this->hasOne(ProfilGw2::class, 'user_id');
    }

    /**
     * Discussions rédigées par l'utilisateur (1-N).
     */
    public function discussions(): HasMany
    {
        return $this->hasMany(Discussion::class, 'user_id');
    }

    /**
     * Commentaires de forum écrits par l'utilisateur (1-N).
     */
    public function commentaires(): HasMany
    {
        return $this->hasMany(Commentaire::class, 'user_id');
    }

    /**
     * Builds créés par l'utilisateur (1-N).
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
     * Adhésions aux guildes de l'utilisateur (table pivot étendue).
     */
    public function membresGuilde(): HasMany
    {
        return $this->hasMany(MembreGuilde::class, 'user_id');
    }
}