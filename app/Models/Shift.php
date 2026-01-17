<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    use HasFactory;

    protected $fillable = [
        'shift_no',
        'date',
        'time_start',
        'time_end',
        'kuota',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    /**
     * Get the plottingans for the shift.
     */
    public function plottingans()
    {
        return $this->hasMany(Plottingan::class);
    }

    /**
     * Get the users assigned to this shift through plottingans.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'plottingans');
    }
}
