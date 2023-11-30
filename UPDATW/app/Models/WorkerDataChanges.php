<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkerDataChanges extends Model
{
    use HasFactory;


    protected $fillable = [
        'id_build_equip', 'id_equip', 'id_build', 'quantity', 'measure', 'equip_year', 'worker_comments',
        'equip_updated', 'equip_deleted', 'cel_january', 'cel_january_gray', 'cel_february', 'cel_february_gray',
        'cel_march', 'cel_march_gray', 'cel_april', 'cel_april_gray', 'cel_may', 'cel_may_gray', 'cel_june',
        'cel_june_gray', 'cel_july', 'cel_july_gray', 'cel_august', 'cel_august_gray', 'cel_september',
        'cel_september_gray', 'cel_october', 'cel_october_gray', 'cel_november', 'cel_november_gray', 'cel_december',
        'cel_december_gray',
    ];

}
