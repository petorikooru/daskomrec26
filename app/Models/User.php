<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nim',
        'password',
        'is_admin',
        'last_activity',
        'last_seen_announcement',
    ];

    protected $casts = [
        'is_admin' => 'boolean',
    ];

    protected $attributes = [
        'is_admin' => false,
        'last_activity' => 1766312339,
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    /**
     * Get the profile for the user.
     */
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    /**
     * Get the plottingans for the user.
     */
    public function plottingans()
    {
        return $this->hasMany(Plottingan::class);
    }

    /**
     * Get the caas stages for the user.
     */
    public function caasStages()
    {
        return $this->hasMany(CaasStage::class);
    }
}
