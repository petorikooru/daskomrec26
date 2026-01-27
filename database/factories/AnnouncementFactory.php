<?php

namespace Database\Factories;

use App\Models\stage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Announcement>
 */
class AnnouncementFactory extends Factory
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
            'success_message' => fake()->sentence(),
            'fail_message' => fake()->sentence(),
            'link' => fake()->url(),
            'stage_id' => fake()->numberBetween(1, 5),
        ];
    }
}
