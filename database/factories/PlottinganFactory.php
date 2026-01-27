<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Plottingan>
 */
class PlottinganFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $userShiftPairs = null;

        if ($userShiftPairs === null) {
            $userShiftPairs = collect(range(1, 10))
                ->crossJoin(range(1, 5))
                ->shuffle()
                ->values()
                ->all();
        }

        $pair = array_shift($userShiftPairs);

        return [
            'user_id' => $pair[0],
            'shift_id' => $pair[1],
        ];
    }
}
