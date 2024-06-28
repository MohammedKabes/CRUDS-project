let form = document.getElementById("form");
let naming = document.getElementById("name");
let number = document.getElementById("number");
let total = document.getElementById("total");
let paid = document.getElementById("paid");
let resudal = document.getElementById("resudal");
let add = document.getElementById("add");
let deleteAll = document.getElementById("deleteAll");
let update = document.getElementById("update");
let deleteing = document.getElementById("delete");
let search = document.getElementById("btnSearch");
let mood = "create";
let temp;
let customer;

//check local storage
if (localStorage.getItem("data") != null) {
  customer = JSON.parse(localStorage.getItem("data"));
} else {
  customer = [];
}

//Total customer price
function price() {
  if (total.value != "" && paid.value != "") {
    let result = +total.value - +paid.value;
    resudal.innerHTML = result;
    resudal.style.backgroundColor = "#4caf50";
  } else {
    resudal.innerHTML = "";
    resudal.style.backgroundColor = "rgb(238, 178, 178)";
  }
}

//validation fields input

//set errors
const setErrors = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");
  errorDisplay.innerText = message;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};
//SUCCESS message
const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");
  errorDisplay.innerText = "";
  inputControl.classList.add("success");
  inputControl.classList.remove("error");
};

//validate Name
let validateNameRegex =
  /^(?:[\u0600-\u06FF]{3,}\s){1,2}[\u0600-\u06FF]{3,}\s*$/u;
function validateName(value) {
  if (value) {
    if (!value.match(validateNameRegex)) {
      setErrors(
        naming,
        " يجب أن يكون الاسم باللغة العربية ومكون من اسمين علي الأٌقل "
      );
      return false;
    } else {
      setSuccess(naming);
      return true;
    }
  } else {
    setErrors(naming, " حقل الاسم مطلوب ");
    return false;
  }
}
//validateNumber
let validateNumberRegex = /^(010|012|011|015)\d{8}$/giu;
function validatePhone(value) {
  if (value) {
    if (!value.match(validateNumberRegex)) {
      setErrors(number, " يجب أن يكون رقم الهاتف مكون من 11 رقم  ");
      return false;
    } else {
      setSuccess(number);
      return true;
    }
  } else {
    setErrors(number, "يرجي إدخال رقم الهاتف بطريقة صحيحة");
    return false;
  }
}
//validte price 
function validateTotal() {
  let totalValue = parseFloat(total.value);
  let paidValue = parseFloat(paid.value);
  if (totalValue || paidValue) {
    if (totalValue == 0 || isNaN(totalValue)) {
      setErrors(total, "من فضلك أدخل المبلغ الكلي");
    } else {
      setSuccess(total);
    }

    if (paidValue == 0 || isNaN(paidValue)) {
      setErrors(paid, "من فضلك أدخل مبلغ القسط");
    } else {
      setSuccess(paid);
    }

    if (paidValue > totalValue) {
      setErrors(paid, "يجب أن يكون قيمة القسط أقل من أو تساوي المبلغ الكلي");
    } else if (isNaN(totalValue)) {
      setErrors(total, "من فضلك أدخل المبلغ الكلي");
    } else if (isNaN(paidValue)) {
      setErrors(paid, "من فضلك أدخل مبلغ القسط");
    } else {
      console.log(paidValue, totalValue, true);
      setSuccess(total);
      setSuccess(paid);
      return true;
    }
  } else {
    setErrors(total, "من فضلك أدخل المبلغ الكلي");
    setErrors(paid, "من فضلك أدخل مبلغ القسط");
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (
    validateName(naming.value) &&
    validatePhone(number.value) &&
    validateTotal()
  ) {
    newCustomer();
  } else {
    alert("من فضلك راجع حقول البيانات ");
  }
});


//create new customer
function newCustomer() {
  let newCustomer = {
    name: naming.value,
    number: number.value,
    total: total.value,
    paid: paid.value,
    resudal: resudal.innerHTML,
  };

  if (mood == "create") {
    customer.push(newCustomer);
    localStorage.setItem("data", JSON.stringify(customer));
    clearInputs();
    showcustomer();
  } else {
    customer[temp] = newCustomer;
    showcustomer();
    clearInputs();
    price();
    mood = "create";
    add.innerHTML = "إضافة";
  }
}

//clear inputs
function clearInputs() {
  naming.value = "";
  number.value = "";
  total.value = "";
  paid.value = "";
  resudal.innerHTML = "";
}

//show data at all
showcustomer();
//show data when add customer
function showcustomer() {
  table = "";
  for (let i = 0; i < customer.length; i++) {
    table += `
   <tr>
            <td>${customer[i].name}</td>
            <td>${customer[i].number}</td>
            <td>${customer[i].total}</td>
            <td>${customer[i].paid}</td>
            <td>${customer[i].resudal}</td>
            <td><button id="update" onclick="updateCustomer(${i})" >تعديل</button></td>
            <td><button id="deleteing" onclick="clearCustomer(${i})">حذف</button></td>
          </tr>
`;
  }
  document.getElementById("table").innerHTML = table;
  if (customer.length > 0) {
    let deleteAll = document.getElementById("deleteAll");

    deleteAll.innerHTML = `
            <button id="deleteCustomers" > حذف كل الأسماء(${customer.length})</button>
    `;
  } else {
    deleteAll.innerHTML = "";
  }
}

//update customer data
function updateCustomer(i) {
  naming.value = customer[i].name;
  number.value = customer[i].number;
  total.value = customer[i].total;
  paid.value = customer[i].paid;
  price();
  add.innerHTML = "تعديل";
  mood = "update";
  temp = i;
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

//clear customer
function clearCustomer(i) {
  customer.splice(i, 1);
  localStorage.data = JSON.stringify(customer);
  showcustomer();
}

//clear all customer
deleteAll.onclick = () => {
  customer.splice(0);
  localStorage.clear();
  showcustomer();
  mood = "create";
  add.innerHTML = "إضافة";
};

//search in data
function searchCustomer(value) {
  let table = "";

  for (let i = 0; i < customer.length; i++) {
    if (customer[i].name.includes(value)) {
      table += `
   <tr>
            <td>${customer[i].name}</td>
            <td>${customer[i].number}</td>
            <td>${customer[i].total}</td>
            <td>${customer[i].paid}</td>
            <td>${customer[i].resudal}</td>
            <td><button id="update" onclick="updateCustomer(${i})" >تعديل</button></td>
            <td><button id="deleteing" onclick="clearCustomer(${i})">حذف</button></td>
          </tr>
`;
    }
  }
  document.getElementById("table").innerHTML = table;
}
