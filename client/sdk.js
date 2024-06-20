const SampleUserId = 'MUID1811';
let checkInterval = null;

const renderStatus = (code) => {
  switch (code) {
    case 'PAYMENT_SUCCESS':
      document.querySelector('.callback.success').style.display = 'flex';
      break;
    case 'PAYMENT_ERROR':
      document.querySelector('.callback.failed').style.display = 'flex';
      break;
    case 'PAYMENT_DECLINED':
      document.querySelector('.callback.cancelled').style.display = 'flex';
      break;
  }
};

async function getStatus(transactionId) {
  try {
    const response = await fetch(
      `https://ginrummy.asia/dps-test/phonepe/get-status/${transactionId}`,
    );

    // Check if the response is not ok (status code is not in the range 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error('There was an error with the fetch operation:', error);
  }
}

let intervalId = null;
// Function to call fetchData repeatedly until it returns non-null
function pollData(transactionId) {
  return new Promise((resolve, reject) => {
    intervalId = setInterval(async () => {
      try {
        let result = await getStatus(transactionId);
        if (result) {
          clearInterval(intervalId);
          resolve(result);
        }
      } catch (error) {
        clearInterval(intervalId);
        reject(error);
      }
    }, 2000); // Poll every 2 seconds
  });
}

async function getCheckoutURL(url, amount) {
  //response time mock
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1);
    }, 2000);
  });

  const payload = {
    userId: SampleUserId,
    amount: amount,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Check if the response is not ok (status code is not in the range 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error('There was an error with the fetch operation:', error);
  }
}

const backdrop = document.createElement('div');
backdrop.style.cssText = `
position: fixed;
inset: 0px;
background: #000000d1;
display: flex;
flex-direction:column;
align-items: center;
justify-content: center;
color:white;
`;

backdrop.innerHTML = `
<h1 style="font-size: 22px;
margin-bottom: 18px;">Please dont close or reload this window</h1>
`;

const disclaimer = document.createElement('div');
disclaimer.style.textAlign = 'center';
disclaimer.innerHTML = `
<p style="font-size: 16px;
margin-bottom: 5px;">Dont see the payment dialog window?</p>
`;

const disclaimerBtn = document.createElement('button');
disclaimerBtn.innerHTML = 'Click here';
disclaimerBtn.style.cssText = `
background: none;
color: white;
border: none;
text-decoration: underline;
font-weight: 600;
font-size: 18px;
cursor: pointer;
outline: none;
`;

disclaimerBtn.addEventListener('click', () => {
  modal.contentWindow.postMessage({ event: 'focus-child' }, '*');
});

disclaimer.appendChild(disclaimerBtn);

window?.addEventListener('message', (event) => {
  if (event.data.name === 'window-event') {
    if (event.data.event === 'CLOSED') {
      // alert(1);
      // window.focus();
      try {
        document.body.removeChild(backdrop);
      } catch (error) {}
      setTimeout(() => {
        clearInterval(intervalId);
      }, 4000);
    }
  }
});

const stylesheet = document.createElement('style');
stylesheet.innerHTML = `
.loader {
  border: 5px solid #0000008c;
  border-radius: 50%;
  border-top: 5px solid #fff;
  width: 50px;
  height: 50px;
  -webkit-animation: spin 1s linear infinite; /* Safari */
  animation: spin 1s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

const loader = document.createElement('div');
loader.className = 'loader';

const modal = document.createElement('iframe');

modal.referrerPolicy = 'no-referrer';
modal.sandbox =
  'allow-same-origin allow-scripts allow-popups allow-forms allow-modals';
modal.style.cssText = `
background: white;
border: none;
border-radius: 6px;
height: 0px;
width: 0px;
visibility:hidden;
`;

const checkout = async (amount) => {
  const usMerchant = '//ginrummy.asia/payments.html';
  const url = 'https://ginrummy.asia/dps-test/phonepe/pay-page';

  document.head.appendChild(stylesheet);
  document.body.appendChild(backdrop);
  backdrop.appendChild(loader);
  const checkoutData = await getCheckoutURL(url, amount);
  const hjk = checkoutData.url;
  const transactionId = checkoutData.transactionId;
  backdrop.removeChild(loader);
  backdrop.appendChild(disclaimer);
  modal.src = usMerchant;

  //   let got = `
  //   document.body.innerHTML = "<iframe src='${hjk}' height='700px' width='435px' style='border:none;'></iframe>"
  // `;
  let width = 430;
  let height = 768;

  let centerX = (window.innerWidth - width) / 2;
  let centerY = (window.innerHeight - height) / 2;
  let got = `
let child = window.open(
    '${hjk}',
    'popup',
    'location=0,width=${width},height=${height},modal=yes,alwaysRaised=yes,toolbar=0,menubar=0,titlebar=no, status=0,left=${centerX},top=${centerY}',
  );

  if(child){
    window.parent.postMessage({name:"window-event", event:"LOADED"}, '*');
    window.addEventListener("message", (event)=>{
   
      if(event.data.event=="focus-child" && child && !child.closed){ 
     child.focus();
      }
    
    })
  }
  console.log('first')

  var timer = setInterval(checkChild, 500);

function checkChild() {
    if (child.closed) {
      window.parent.postMessage({name:"window-event", event:"CLOSED"}, '*');  
        clearInterval(timer);
    }
} 
`;

  backdrop.appendChild(modal);
  modal.addEventListener('load', () => {
    modal.contentWindow.postMessage(got, '*');
  });

  // Start polling and handle the resolved data
  pollData(transactionId)
    .then((data) => {
      console.log('Data received:', data);
      renderStatus(data?.data?.code);
      // Handle the data here
    })
    .catch((error) => {
      console.error('Polling failed:', error);
    });
};
