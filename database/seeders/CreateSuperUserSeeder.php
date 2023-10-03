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
//        $superUser = User::create([
//            'email'=>'cpsaf@23ail.com',
//            'name'=>'cpsaf',
//            'password'=>Hash::make('1234567890'),
//            'created_at'=>Carbon::now(),
//            'updated_at'=>Carbon::now(),
//        ]);
//        Role::create([
//            'name'=>'user',
//            'created_at'=>Carbon::now(),
//            'updated_at'=>Carbon::now(),
//        ]);
//        $superUser -> assignRole('user');
        $UserGP1 = User::create([
            'email' => 'GP1',
            'name' => 'GP1',
            'password' => Hash::make('344602'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Role::create([
            'name' => 'workerGP',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        $UserGP1->assignRole('workerGP');

        $UserGP1v = User::create([
            'email' => 'GP1v',
            'name' => 'GP1v',
            'password' => Hash::make('530223'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        $UserGP1v->assignRole('workerGP');

        $UserGP2 = User::create([
            'email' => 'GP2',
            'name' => 'GP2',
            'password' => Hash::make('637270'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        $UserGP2->assignRole('workerGP');

        $UserGP3 = User::create([
            'email' => 'GP3',
            'name' => 'GP3',
            'password' => Hash::make('695732'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        $UserGP3->assignRole('workerGP');

        $UserGP4 = User::create([
            'email' => 'GP4',
            'name' => 'GP4',
            'password' => Hash::make('307795'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        $UserGP4->assignRole('workerGP');

        $UserGP5 = User::create([
            'email' => 'GP5',
            'name' => 'GP5',
            'password' => Hash::make('222853'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        $UserGP5->assignRole('workerGP');

        $UserGP6 = User::create([
            'email' => 'GP6',
            'name' => 'GP6',
            'password' => Hash::make('414672'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        $UserGP6->assignRole('workerGP');

        $UserGP7 = User::create([
            'email' => 'GP7',
            'name' => 'GP7',
            'password' => Hash::make('813024'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        $UserGP7->assignRole('workerGP');

        $UserGP9 = User::create([
            'email' => 'GP9',
            'name' => 'GP9',
            'password' => Hash::make('956464'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        $UserGP9->assignRole('workerGP');

        $UserNur = User::create([
            'email' => 'Nur',
            'name' => 'Nur',
            'password' => Hash::make('310241'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Role::create([
            'name' => 'Nur_master',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        $UserNur->assignRole('Nur_master');

        $UserVGK6 = User::create([
            'email' => 'VGK6',
            'name' => 'VGK6',
            'password' => Hash::make('588876'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        $UserVGK6->assignRole('workerGP');

        $UserYamburg = User::create([
            'email' => 'Yamburg',
            'name' => 'Yamburg',
            'password' => Hash::make('489222'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Role::create([
            'name' => 'Yamburg_master',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        $UserYamburg->assignRole('Yamburg_master');

        $UserZapolyarka = User::create([
            'email' => 'Zapolyarka',
            'name' => 'Zapolyarka',
            'password' => Hash::make('782248'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Role::create([
            'name' => 'Zapolyarka_master',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        $UserZapolyarka->assignRole('Zapolyarka_master');

    }
}
