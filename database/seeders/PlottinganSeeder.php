<?php

namespace Database\Seeders;

use App\Models\Plottingan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlottinganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Plottingan::truncate();
        Plottingan::factory()->count(10)->create();
    }
}
