<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Profile>
 */
class ProfileFactory extends Factory
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
            'user_id' => fake()->numberBetween(1, 10), // Associate profile with a user
            'name' => fake()->name(),
            'major' => fake()->word(),
            'email' => fake()->unique()->safeEmail(),
            'class' => fake()->word(),
            'gender' => fake()->randomElement(['Male', 'Female']),
        ];
    }
}
