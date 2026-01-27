<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'success_message',
        'fail_message',
        'link',
        'stage_id',
    ];

    /**
     * Get the stage that owns the announcement.
     */
    public function stage()
    {
        return $this->belongsTo(Stage::class);
    }
}
