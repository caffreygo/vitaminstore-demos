async function unsubscribeAll() {
  let result = await submitToVitaminstore();
  if (result) {
    document.getElementById("form").submit();
  }
}

async function changeSubscription() {
  let result = await submitToVitaminstore();
  if (result) {
    document.getElementById("form").submit();
  }
}

async function submitToVitaminstore() {
  try {
    let email = document.getElementById("email").innerText;
    let newsletter = document.getElementById("category_newsletter").checked;
    let promotional = document.getElementById(
      "category_promotional-email"
    ).checked;
    let physicalMagazine = document.getElementById(
      "category_physical-magazine"
    ).checked;
    let model = {
      Email: email,
      PhysicalMagazineSubscribed: newsletter,
      NewsletterSubscribed: promotional,
      PromotionalEmailSubscribed: physicalMagazine,
    };
    const response = await fetch(
      "https://localhost:5009/bloomreach/update-consent",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Apikey 1ad5f3ac-d91f-432f-90f1-58f1fd11aef4",
        },
        body: JSON.stringify(model),
        mode: "cors",
        credentials: "same-origin",
        cache: "no-cache",
      }
    );

    if (response.ok) {
      return true;
    } else {
      //alert('encounter some error please try again later');
      return false;
    }
  } catch (ex) {
    console.log(ex);
    //alert('encounter network issue  please try again later');
  }
}

// // 获取表单和提交按钮
// const form = document.getElementById("subscription-form");
// const submitButton = document.getElementById("submit-button");

// // 添加点击事件监听器
// submitButton.addEventListener("click", function () {
//     // 获取选中的复选框的值
//     const formData = {
//         newsletter: form.querySelector('input[name="newsletter"]').checked,
//         promotionalEmail: form.querySelector('input[name="promotionalEmail"]').checked,
//         physicalMagazine: form.querySelector('input[name="physicalMagazine"]').checked,
//     };

//     // 这里可以添加额外的逻辑，如将数据发送到服务器
//     console.log(formData);

//     // 如果要提交表单，可以使用以下代码：
//     // form.submit();
// });