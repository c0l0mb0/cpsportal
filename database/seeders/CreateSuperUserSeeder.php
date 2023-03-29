<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class CreateSuperUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superUser = User::create([
            'email'=>'cpsaf@23ail.com',
            'name'=>'cpsaf',
            'password'=>Hash::make('1234567890'),
            'created_at'=>Carbon::now(),
            'updated_at'=>Carbon::now(),
        ]);
        Role::create([
            'name'=>'user',
            'created_at'=>Carbon::now(),
            'updated_at'=>Carbon::now(),
        ]);
        $superUser -> assignRole('user');
    }
}
