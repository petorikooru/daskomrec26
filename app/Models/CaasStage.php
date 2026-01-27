<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaasStage extends Model
{
    use HasFactory;

    protected $fillable = [
        'status',
        'user_id',
        'stage_id',
    ];

    protected $attributes = [
        'status' => 'GAGAL',
    ];

    /**
     * Get the user that owns the caas stage.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the stage that owns the caas stage.
     */
    public function stage()
    {
        return $this->belongsTo(Stage::class);
    }
}
