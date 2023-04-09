
$(document).ready(function () {
  $('#registerform').submit(function (event) {
    // 防止提交默認
    event.preventDefault();

    // 獲取表單數據
    var account = $('#Username').val();
    var password = $('#Password').val();
    var name = $('#Name').val();
    var contactNumber = $('#Phone').val();

    // POST Requests with JSON
    $.ajax({
      url: 'http://127.0.0.1:8000/membership/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        account: account,
        password: password,
        name: name,
        phone: contactNumber
      }),

      success: function (response) {
        console.log(response);
        alert('Register success!');
        // 跳轉到/signin
        window.location.href = "/login";
      },
      error: function (xhr, status, error) {
        if (xhr.status === 400) {
          alert('Account already exist');
        }
        console.error(error);
        // 清空欄位
        $('#Username').val('');
        $('#Password').val('');
        $('#Name').val('');
        $('#Phone').val('');
      }
    });
  });
});

