<?php

namespace Database\Seeders;

use App\Models\Puzzle;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PuzzleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Puzzle::factory()->count(4)->create();
    }
}
