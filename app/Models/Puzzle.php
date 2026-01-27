<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Puzzle extends Model
{
    use HasFactory;

    protected $fillable = [
        'question',
        'description',
        'clue',
        'answer',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    protected $attributes = [
        'answer' => '0',
        'status' => false,
    ];
}
