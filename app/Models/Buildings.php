<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Buildings extends Model
{
    use HasFactory;


    protected $fillable = [
        'id_equip_master_type_locat', 'plan_graf', 'on_conserv', 'id_equip_master_type', 'grnumb', 'queue',
        'affiliate', 'plan_graf_book', 'plan_graf_worksheet', 'worksheet_group_1', 'worksheet_group_2', 'fitt',
        'proj', 'fitt_year', 'proj_year', 'equip_master_type', 'equip_master_type_locat', 'type_aups',
        'who_change', 'who_create', 'who_delete', 'to_date', 'to_obj_name', 'to_sec_obj_name', 'aud_warn_type', 'categ_asu',
        'pasp_numb_syst', 'equip_year_avr', 'area', 'group_1', 'group_2', 'group_3', 'shed',
    ];

}
