<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Shift>
 */
class ShiftFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'shift_no' => fake()->unique()->numberBetween(1, 10),
            'date' => fake()->date(),
            'time_start' => fake()->time(),
            'time_end' => fake()->time(),
            'kuota' => fake()->numberBetween(1, 30),
        ];
    }
}
