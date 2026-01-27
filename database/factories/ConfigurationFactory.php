<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Configuration>
 */
class ConfigurationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
            'pengumuman_on' => fake()->boolean(),
            'isi_jadwal_on' => fake()->boolean(),
            'puzzles_on' => fake()->boolean(),
            'current_stage_id' => fake()->numberBetween(1, 5),
        ];
    }
}
