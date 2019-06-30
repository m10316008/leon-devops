function resetForm() {
    $("#btnCreateStaff").hide();
    $("#btnUpdateStaff").hide();

    $("#username").attr('readonly', 'readonly');

    $("#formModal input").each(function (index) {
        $(this).val('');
    });
    $("#formModal select").each(function (index) {
        $(this).prop("selectedIndex", 0);
    });

}

function clickShowForm(username) {
    var isEdit = true;
    if (username.trim().length <= 0) {
        isEdit = false;
    }
    resetForm();
    if (isEdit) {
        $.get("staff/staff?username=" + username, function (data) {
            $("#userRole").val(data.userRole);
            $("#active").val(data.active.toString());
            $("#brand").val(data.brand);
            $("#username").val(data.username);

            $("#btnUpdateStaff").show();
        });
    } else {
        $("#username").removeAttr('readonly');
        $("#btnCreateStaff").show();
    }
    $("#formModal").modal('show');
}

function validateForm(data) {
    return true;
}

function serialize(isCreate) {
    var data = {
        username: $("#username").val(),
        userRole: $("#userRole").val(),
        active: $("#active").val(),
        brand: $("#brand").val()
    }

    if (isCreate || $("#password").val().length >= 6) {
        data.password = $("#password").val();
    }

    return data;
}

function clickCreateStaff() {
    $("#btnCreateStaff").attr("disabled", "disabled");
    //alert('clickCreateStaff()');

    var data = serialize(true);
    if (validateForm(data)) {
        $.ajax({
            url: 'staff/staff',
            type: 'PUT',
            data: data,
            success: function (data) {
                if (data) {
                    location.reload();
                } else {
                    alert('建立 Error !');
                    $("#btnCreateStaff").removeAttr("disabled");
                }
            }
        });
    }
}

function clickUpdateStaff() {
    $("#btnUpdateStaff").attr("disabled", "disabled");
    //alert('clickUpdateStaff()');

    var data = serialize(false);
    if (validateForm(data)) {
        $.ajax({
            url: 'staff/staff',
            type: 'PATCH',
            data: data,
            success: function (data) {
                if (data) {
                    location.reload();
                } else {
                    alert('保存 Error !')
                    $("#btnUpdateStaff").removeAttr("disabled");
                }
            }
        });
    }
}