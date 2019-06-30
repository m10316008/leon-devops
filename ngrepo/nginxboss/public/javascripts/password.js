$("#divSubmitMessage").hide();

function clickSubmit() {
    $("#btnSubmit").attr("disabled", "disabled");

    var password = $("#inputPassword").val();
    var password1 = $("#inputPassword1").val();
    var password2 = $("#inputPassword2").val();

    //check two password is same
    if (password1 != password2) {
        $('#modalMessage').html('<h3>新密碼和確認密碼, 不正確<h3>');
        $('#myModal').modal('show');
        $("#btnSubmit").removeAttr("disabled");
        return;
    }

    if (password1.length < 6) {
        $('#modalMessage').html('<h3>新密碼最少 6 位<h3>');
        $('#myModal').modal('show');
        $("#btnSubmit").removeAttr("disabled");
        return;
    }

    $.post('password', { password: password, newPassword: password1 }, function (data) {
        if (data) {
            $("#divSubmit").html("");
            $("#divSubmitMessage").show();
        } else {
            $('#modalMessage').html('<h3>舊密碼不正確<h3>');
            $('#myModal').modal('show');
            $("#btnSubmit").removeAttr("disabled");
        }
    });
}