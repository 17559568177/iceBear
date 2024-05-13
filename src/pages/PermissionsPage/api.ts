import request from '@/service';
import { useUserStore } from '@/store/user';

export async function fetchUserPermissions() {
    return request(`rag/get_allUser/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: { adminId: useUserStore.getState().usrId }
    });
}

export async function fetchDpPermissions() {
    return request(`rag/get_allIdentityGroup/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: { adminId: useUserStore.getState().usrId }
    });
}

export async function newUserAPI(data: {
    usrId: string;
    name: string;
    password: string;
    department: string[];
    role: string;
}) {
    // console.log(data, 'data');

    const params = {
        username: data.usrId,
        nickname: data.name,
        password: data.password,
        groupIds: data.department,
        adminStatus: data.role==='S'? 2:data.role==='R'? 1:0,
        adminId: useUserStore.getState().usrId
    };
    return request<{ status: string; usrId: string }>(`rag/new_user/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: params
    });
}

export async function newDpAPI(data: { department: string; description?: string }) {

    const params = {
        groupName: data.department,
        groupDescription: data?.description ?? '',
        adminId: useUserStore.getState().usrId
    };
    return request<{ status: string; usrId: string }>(`rag/new_identityGroup/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: params
    });
}

export async function changePermissionAPI(data:{key: string, role: string}) {
    const params = {
        usrId: data.key,
        adminStatus: data.role==='S'? 2:data.role==='R'? 1:0,
        adminId: useUserStore.getState().usrId
    };
    return request<{ status: string; usrId: string }>(`rag/change_adminStatus/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: params
    });
    
}

export async function updatePasswordAPI(data: { key: string; password: string }) {
    const params = {
        usrId: data.key,
        newPassword: data.password,
        adminId: useUserStore.getState().usrId
    };
    return request<{ status: string; usrId: string }>(`rag/update_password/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: params
    });
}

export async function activateUserAPI(rowKeys: string[]) {
    const params = {
        usrIds: rowKeys,
        adminId: useUserStore.getState().usrId
    };
    return request<{ status: string; usrId: string }>(`rag/activate_users/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: params
    });
}


export async function deactivateUserAPI(rowKeys: string[]) {
    const params = {
        usrIds: rowKeys,
        adminId: useUserStore.getState().usrId
    };
    return request<{ status: string; usrId: string }>(`rag/deactivate_users/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: params
    });
}

export async function deleteDpAPI(data:{key: string}) {
    const params = {
        groupId: data.key,
        adminId: useUserStore.getState().usrId
    };
    return request<{ status: string; usrId: string }>(`rag/remove_identityGroup/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: params
    });
}

export async function addUserToDpAPI(data:{rowKeys: string; department:string[]}) {
    const params = {
        usrIds: data.rowKeys,
        groupIds: data.department,
        adminId: useUserStore.getState().usrId
    };
    return request<{ status: string; usrId: string }>(`rag/add_userIdentity/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: params
    });
}

export async function removeUserFromDpAPI(data:{rowKeys: string; department:string[]}) {
    const params = {
        usrIds: data.rowKeys,
        groupIds: data.department,
        adminId: useUserStore.getState().usrId
    };
    return request<{ status: string; usrId: string }>(`rag/remove_userIdentity/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: params
    });
}