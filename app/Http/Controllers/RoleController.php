<?php

namespace App\Http\Controllers;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::orderBy('name' )->where('name', '!=','super-user')->get();
        return view('roles.index', compact(['roles']));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $permissions = Permission::orderBy('name')->get();
        return view('roles.create', compact(['permissions']));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'=>'required|max:255',
            'permissions.*'=>'required|integer|exists:permissions,id',
        ]);
        $newRole = Role::create([
           'name'=>$request->name
        ]);
        $permissions= Permission::whereIn('id',$request->permissions)->get();
        $newRole->syncPermissions($permissions);

        return redirect()->back()->with('status', 'Role added');
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        $role = Role::where('name','!=','super-user')->findOrFail($role->id);
        $permissions = Permission::orderBy('name')->get();
        return view('roles.edit', compact(['permissions','role']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name'=>'required|max:255',
            'permissions'=>'required',
            'permissions.*'=>'required|integer|exists:permissions,id',
        ]);
        $role->update([
           'name'=>$request->name
        ]);
        $permissions= Permission::whereIn('id',$request->permissions)->get();
        $role->syncPermissions($permissions);

        return redirect()->back()->with('status', 'Role updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $role = Role::findOrFail($id)->delete();
        return redirect()->route('roles.index')->with('status', 'Role deleted');
    }
}
