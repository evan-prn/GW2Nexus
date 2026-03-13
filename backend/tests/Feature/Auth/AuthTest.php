<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * Tests fonctionnels de la feature Authentification.
 *
 * Couvre l'intégralité du cycle d'authentification :
 *   - Inscription (RegisterController)
 *   - Connexion avec rate limiting (LoginController)
 *   - Déconnexion simple et globale (LogoutController)
 *   - Demande de lien de réinitialisation (ForgotPasswordController)
 *   - Réinitialisation effective (ResetPasswordController)
 *
 * Chaque test est isolé via RefreshDatabase : la base est réinitialisée
 * entre chaque méthode de test.
 */
class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Initialisation exécutée avant chaque test.
     *
     * Intercepte toutes les notifications (dont le mail de réinitialisation
     * de mot de passe) pour éviter tout appel réseau ou SMTP pendant les tests.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Bloque l'envoi réel de notifications (emails, SMS, etc.)
        Notification::fake();
    }

    // =========================================================================
    // Helpers privés
    // =========================================================================

    /**
     * Crée et retourne un utilisateur de test avec des attributs par défaut.
     */
    private function creerUtilisateur(array $attributs = []): User
    {
        return User::factory()->create(array_merge([
            'email'    => 'joueur@gw2nexus.test',
            'password' => Hash::make('MotDePasse123!'),
        ], $attributs));
    }

    /**
     * Retourne les données valides pour un formulaire d'inscription.
     */
    private function donneesInscriptionValides(): array
    {
        return [
            'nom'                   => 'Gardien des Brumes',
            'email'                 => 'nouveau@gw2nexus.test',
            'password'              => 'MotDePasse123!',
            'password_confirmation' => 'MotDePasse123!',
        ];
    }

    // =========================================================================
    // Inscription — RegisterController
    // =========================================================================

    #[Test]
    public function un_utilisateur_peut_s_inscrire_avec_des_donnees_valides(): void
    {
        $reponse = $this->postJson('/api/v1/auth/register', $this->donneesInscriptionValides());

        $reponse->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'user' => ['id', 'nom', 'email', 'role', 'has_api_key'],
                'token',
            ])
            ->assertJsonPath('user.email', 'nouveau@gw2nexus.test')
            ->assertJsonPath('user.role', 'user');

        $this->assertDatabaseHas('users', ['email' => 'nouveau@gw2nexus.test']);
    }

    #[Test]
    public function l_inscription_echoue_si_l_email_est_deja_utilise(): void
    {
        $this->creerUtilisateur(['email' => 'existe@gw2nexus.test']);

        $reponse = $this->postJson('/api/v1/auth/register', [
            ...$this->donneesInscriptionValides(),
            'email' => 'existe@gw2nexus.test',
        ]);

        $reponse->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function l_inscription_echoue_si_la_confirmation_de_mot_de_passe_ne_correspond_pas(): void
    {
        $reponse = $this->postJson('/api/v1/auth/register', [
            ...$this->donneesInscriptionValides(),
            'password_confirmation' => 'MauvaisMotDePasse!',
        ]);

        $reponse->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    #[Test]
    public function l_inscription_echoue_si_le_mot_de_passe_est_trop_court(): void
    {
        $reponse = $this->postJson('/api/v1/auth/register', [
            ...$this->donneesInscriptionValides(),
            'password'              => 'court',
            'password_confirmation' => 'court',
        ]);

        $reponse->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    #[Test]
    public function le_mot_de_passe_est_stocke_hache_en_base(): void
    {
        $this->postJson('/api/v1/auth/register', $this->donneesInscriptionValides());

        $utilisateur = User::where('email', 'nouveau@gw2nexus.test')->firstOrFail();

        // Le mot de passe brut ne doit jamais être stocké en clair
        $this->assertNotEquals('MotDePasse123!', $utilisateur->password);
        $this->assertTrue(Hash::check('MotDePasse123!', $utilisateur->password));
    }

    // =========================================================================
    // Connexion — LoginController
    // =========================================================================

    #[Test]
    public function un_utilisateur_peut_se_connecter_avec_ses_identifiants(): void
    {
        $this->creerUtilisateur();

        $reponse = $this->postJson('/api/v1/auth/login', [
            'email'    => 'joueur@gw2nexus.test',
            'password' => 'MotDePasse123!',
        ]);

        $reponse->assertOk()
            ->assertJsonStructure([
                'message',
                'user'  => ['id', 'nom', 'email'],
                'token',
            ]);
    }

    #[Test]
    public function la_connexion_echoue_avec_un_mauvais_mot_de_passe(): void
    {
        $this->creerUtilisateur();

        $reponse = $this->postJson('/api/v1/auth/login', [
            'email'    => 'joueur@gw2nexus.test',
            'password' => 'MauvaisMotDePasse!',
        ]);

        $reponse->assertStatus(401)
            ->assertJsonPath('message', 'Identifiants incorrects.');
    }

    #[Test]
    public function la_connexion_est_bloquee_apres_5_tentatives_echouees(): void
    {
        $this->creerUtilisateur();

        // 5 tentatives échouées
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/auth/login', [
                'email'    => 'joueur@gw2nexus.test',
                'password' => 'MauvaisMotDePasse!',
            ]);
        }

        // La 6ème doit être bloquée par le rate limiter
        $reponse = $this->postJson('/api/v1/auth/login', [
            'email'    => 'joueur@gw2nexus.test',
            'password' => 'MotDePasse123!', // Même le bon mot de passe est bloqué
        ]);

        $reponse->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    // =========================================================================
    // Déconnexion — LogoutController
    // =========================================================================

    #[Test]
    public function un_utilisateur_authentifie_peut_se_deconnecter(): void
    {
        $utilisateur = $this->creerUtilisateur();

        // On génère un vrai token persisté en base, puis on l'envoie via withToken().
        // actingAs(..., 'sanctum') seul produit un TransientToken (non persisté) :
        // currentAccessToken()->delete() n'existe pas dessus → 500 dans LogoutController.
        $token = $utilisateur->createToken('web')->plainTextToken;

        $reponse = $this->withToken($token)
            ->postJson('/api/v1/auth/logout');

        $reponse->assertOk()
            ->assertJsonPath('message', 'Déconnexion réussie.');

        // Vérification : le token doit être supprimé de la base après déconnexion
        $this->assertCount(0, $utilisateur->fresh()->tokens);
    }

    #[Test]
    public function un_utilisateur_peut_se_deconnecter_de_tous_ses_appareils(): void
    {
        $utilisateur = $this->creerUtilisateur();

        // Création de 3 tokens (simule 3 appareils connectés)
        $utilisateur->createToken('web');
        $utilisateur->createToken('mobile');
        $utilisateur->createToken('tablet');

        $this->assertCount(3, $utilisateur->tokens);

        $this->actingAs($utilisateur, 'sanctum')
            ->postJson('/api/v1/auth/logout-all')
            ->assertOk();

        // Tous les tokens doivent être supprimés
        $this->assertCount(0, $utilisateur->fresh()->tokens);
    }

    #[Test]
    public function un_utilisateur_non_authentifie_ne_peut_pas_acceder_aux_routes_protegees(): void
    {
        $this->postJson('/api/v1/auth/logout')
            ->assertStatus(401);
    }

    // =========================================================================
    // Mot de passe oublié — ForgotPasswordController
    // =========================================================================

    #[Test]
    public function une_demande_de_reinitialisation_retourne_toujours_200(): void
    {
        // Avec un email qui existe en base
        $this->creerUtilisateur();

        $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'joueur@gw2nexus.test',
        ])->assertOk();

        // Avec un email qui n'existe pas (protection contre l'énumération)
        $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'inexistant@gw2nexus.test',
        ])->assertOk();
    }

    // =========================================================================
    // Réinitialisation du mot de passe — ResetPasswordController
    // =========================================================================

    #[Test]
    public function un_utilisateur_peut_reinitialiser_son_mot_de_passe_avec_un_token_valide(): void
    {
        $utilisateur = $this->creerUtilisateur();

        // Génération d'un vrai token Laravel (identique au flux email)
        $token = Password::createToken($utilisateur);

        $reponse = $this->postJson('/api/v1/auth/reset-password', [
            'token'                 => $token,
            'email'                 => 'joueur@gw2nexus.test',
            'password'              => 'NouveauMotDePasse123!',
            'password_confirmation' => 'NouveauMotDePasse123!',
        ]);

        $reponse->assertOk()
            ->assertJsonPath('message', 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.');

        // Vérification que le nouveau mot de passe est bien actif
        $this->assertTrue(
            Hash::check('NouveauMotDePasse123!', $utilisateur->fresh()->password)
        );
    }

    #[Test]
    public function la_reinitialisation_echoue_avec_un_token_invalide(): void
    {
        $this->creerUtilisateur();

        $reponse = $this->postJson('/api/v1/auth/reset-password', [
            'token'                 => 'token-completement-invalide',
            'email'                 => 'joueur@gw2nexus.test',
            'password'              => 'NouveauMotDePasse123!',
            'password_confirmation' => 'NouveauMotDePasse123!',
        ]);

        $reponse->assertStatus(422);
    }

    #[Test]
    public function un_utilisateur_authentifie_peut_recuperer_ses_informations(): void
    {
        $utilisateur = $this->creerUtilisateur();
        $token = $utilisateur->createToken('web')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonStructure([
                'user' => ['id', 'nom', 'email', 'role', 'has_api_key'],
            ])
            ->assertJsonPath('user.email', 'joueur@gw2nexus.test');
    }

    #[Test]
    public function un_visiteur_ne_peut_pas_acceder_a_la_route_me(): void
    {
        $this->getJson('/api/v1/auth/me')
            ->assertStatus(401);
    }
}