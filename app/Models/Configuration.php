<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Configuration extends Model
{
    use HasFactory;

    protected $fillable = [
        'pengumuman_on',
        'isi_jadwal_on',
        'puzzles_on',
        'current_stage_id',
    ];

    protected $casts = [
        'pengumuman_on' => 'boolean',
        'isi_jadwal_on' => 'boolean',
        'puzzles_on' => 'boolean',
    ];

    protected $attributes = [
        'pengumuman_on' => false,
        'isi_jadwal_on' => false,
        'puzzles_on' => false,
    ];

    /**
     * Get the current stage.
     */
    public function currentStage()
    {
        return $this->belongsTo(Stage::class, 'current_stage_id');
    }
}
