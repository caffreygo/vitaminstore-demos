function submitToVitaminstore(callback) {
  let formData;

  try {
    const formEl = document.getElementById("form");

    formData = {
      Email: document.getElementById("email").innerText,
      NewsletterSubscribed: formEl.querySelector('input[name="newsletter"]')
        .checked,
      PromotionalEmailSubscribed: formEl.querySelector(
        'input[name="promotional-email"]'
      ).checked,
      PhysicalMagazineSubscribed: formEl.querySelector(
        'input[name="physical-magazine"]'
      ).checked,
    };
  } catch (error) {
    console.error(error);
    callback(
      false,
      "Veldnamen komen niet overeen, controleer op wijzigingen."
    );
    return;
  }

  try {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://marketing-api-dev.vitaminstore.nl/bloomreach/update-consent",
      true
    );
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader(
      "Authorization",
      "Apikey 1ad5f3ac-d91f-432f-90f1-58f1fd11aef4"
    );

    xhr.withCredentials = true;
    xhr.setRequestHeader("Cache-Control", "no-cache");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          callback(true);
        } else if (xhr.status === 500) {
          callback(false, "Interne serverfout, probeer het later opnieuw.");
        } else {
          callback(false, "Onbekende fout opgetreden.");
        }
      }
    };

    xhr.send(JSON.stringify(formData));
  } catch (error) {
    console.error(error);
    callback(
      false,
      "Kan geen verbinding maken met de server, controleer alstublieft de internetverbinding."
    );
  }
}

function changeSubscription() {
  submitToVitaminstore(function (success, errorMessage) {
    if (success) {
      // document.getElementById('form').submit();
    } else {
      document.getElementById("errorAlert").style.display = "block";
      document.getElementById("errorAlertContent").innerText = errorMessage;
    }
  });
}
