$(document).ready(function () {
  var PAGE_SIZE = 10; // 每頁顯示的資料筆數
  var currentPage = 1; // 當前頁碼
  var totalPages = 1;
  var nextButton = $('<button/>', {
    text: '下一頁',
    class: 'btn btn-primary',
    id: 'nextButton',
    click: function () {
      currentPage++;
      updateMemberList();
    }
  });
  var backButton = $('<button/>', {
    text: '上一頁',
    class: 'btn btn-primary',
    id: 'backButton',
    click: function () {
      currentPage--;
      updateMemberList();
    }
  });

  // 定義updateMemberList()
  function updateMemberList() {
    // 清空原有數據
    $('#memberList tbody').empty();

    // 清空第一列checkbox
    $('#memberList thead tr th:first-child').remove();
    $('#selectAllCheckbox').remove();

    // 定義checkbox
    var selectAllCheckbox = $('<input type="checkbox" id="selectAllCheckbox"/>');
    // 绑定全選checkbox的change事件
    selectAllCheckbox.on('change', function () {
      if ($(this).is(':checked')) {
        // 複選所有checkbox
        $('#memberList tbody input[type="checkbox"]').prop('checked', true);
      } else {
        // 取消複選所有checkbox
        $('#memberList tbody input[type="checkbox"]').prop('checked', false);
      }
    });

    // 第一列新增複選checkbox
    $('#memberList thead tr').prepend($('<th scope="col"></th>').append(selectAllCheckbox));

    // GET所有會員資料
    $.ajax({
      url: 'http://127.0.0.1:8000/membership/',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        var memberList = $('#memberList');
        totalPages = Math.ceil(data.length / PAGE_SIZE);
        // 將下一頁按鈕新增到頁面上

        if (currentPage < totalPages) {
          $('#memberList').after(nextButton);
        }
        if (currentPage > 1) {
          $('#memberList').after(backButton);
        }

        // 計算分頁總數
        totalPages = Math.ceil(data.length / PAGE_SIZE);
        console.log(currentPage)
        console.log(totalPages)

        if (currentPage <= 1) {
          $('#backButton').hide();
        } else {
          $('#backButton').show();
        }
        if (currentPage >= totalPages) {
          $('#nextButton').hide();
        } else {
          $('#nextButton').show();
        }

        // 載入下一頁資料
        var startIndex = (currentPage - 1) * PAGE_SIZE;
        var endIndex = startIndex + PAGE_SIZE;
        var slicedData = data.slice(startIndex, endIndex);


        $.each(slicedData, function (index, member) {
          var row = $('<tr></tr>');

          // 在第一欄新增選取框
          row.append($('<td><input type="checkbox" class="form-check-input" id="checkbox' + index + (currentPage * 10 - 10) + '"></td>'));

          row.append($('<th scope="row"></th>').text(index + 1 + (currentPage * PAGE_SIZE - PAGE_SIZE)));
          row.append($('<td></td>').text(member.account));
          row.append($('<td></td>').text(member.password));
          row.append($('<td></td>').text(member.name));
          row.append($('<td></td>').text(member.phone));
          memberList.append(row);

          // 綁定數據
          $('#checkbox' + index).on('change', function () {
            if ($(this).is(':checked')) {
              // 印出來
              console.log('選取了第' + (index + 1) + '行數據。');
            } else {

              console.log('取消選取了第' + (index + 1) + '行數據。');
            }
          });
        });
      },
      error: function () {
        // FAIL
        alert('讀取失敗');
      }
    });
  }
  $('#RefreshData').on('click', function () {
    updateMemberList(); // 更新資料
  });

  $('#DeleteAccount').on('click', function () {
    // 讀取選取的資料
    $('#memberList tbody input[type="checkbox"]:checked').each(function () {
      // 獲取Account
      var account = $(this).closest('tr').find('td:eq(1)').text();

      //  DELETE
      $.ajax({
        url: 'http://127.0.0.1:8000/membership/' + account,
        type: 'DELETE',
        dataType: 'json',
        success: function (data) {
          console.log('删除 ' + account + ' 成功');
          alert('删除 ' + account + ' 成功');
          // 刪除tr
          $(this).closest('tr').remove();
          updateMemberList();

        },
        error: function () {
          console.log('删除 ' + account + ' 失敗');
        }
      });
    });
  });

});
