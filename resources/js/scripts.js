const form = document.getElementById("transactionForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let transactionFormData = new FormData(form);
  let transactionObj = convertFormDataTransactionObj(transactionFormData);
  if(isValidTransactionForm(transactionObj)){
    saveTransactionObj(transactionObj);
    insertRowInTransactionTable(transactionObj);
    form.reset();
  }else{

  }
  
});

document.addEventListener("DOMContentLoaded", function (event) {
  draw_category();
  let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"));
  Object.values(transactionObjArr).forEach((value) => {
    insertRowInTransactionTable(value);
  });
});

function draw_category(){
  let allCategories=[
    "Alquiler", "Comida", "Diversion", "Antojo", "Gasto", "Transporte"
  ]
  for(let i=0; i<allCategories.length; i++){
    insertCategory(allCategories[i]);
  }
}

function insertCategory(categoryName){
  const selectElement = document.getElementById("transactionCategory");
  let htmlToInsert = `<option>${categoryName}</option>`;
  selectElement.insertAdjacentHTML("beforeend", htmlToInsert);
}

function isValidTransactionForm(transactionObj){
  let isValidForm = true;
  if(!transactionObj["transactionType"]){
    alert("Tu transaction type no es valido, ponele algo");
    isValidForm = false;
  }
  if(!transactionObj["transactionDescription"]){
    alert("Debes colocar algo en la transaction Description");
    isValidForm = false;
  }
  if(!transactionObj["transactionAmount"]){
    alert("Debes colocar un monto");
    isValidForm = false;
  }else if(transactionObj["transactionAmount"] < 0){
    alert("No debes colocar numeros negativos");
    isValidForm = false;
  }
  return isValidForm;
}


function getNewTransactionId() {
  let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1";
  let newTransactionId = JSON.parse(lastTransactionId) + 1;
  localStorage.setItem("lastTransactionId", JSON.stringify(newTransactionId));
  return newTransactionId;
}

function convertFormDataTransactionObj(transactionFormData) {
  let transactionType = transactionFormData.get("transactionType");
  let transactionDescription = transactionFormData.get(
    "transactionDescription"
  );
  let transactionAmount = transactionFormData.get("transactionAmount");
  let transactionCategory = transactionFormData.get("transactionCategory");
  let transactionId = getNewTransactionId();

  return {
    transactionType: transactionType,
    transactionDescription: transactionDescription,
    transactionAmount: transactionAmount,
    transactionCategory: transactionCategory,
    transactionId: transactionId,
  };
}

function insertRowInTransactionTable(transactionObj) {
  let transactionTableRef = document.getElementById("transactionTable");
  let newTransactionRowRef = transactionTableRef.insertRow(-1);
  newTransactionRowRef.setAttribute("data-transaction-id",
    transactionObj["transactionId"]
  );
  let newTypeCellRef = newTransactionRowRef.insertCell(0);
  newTypeCellRef.textContent = transactionObj["transactionType"];

  newTypeCellRef = newTransactionRowRef.insertCell(1);
  newTypeCellRef.textContent = transactionObj["transactionDescription"];

  newTypeCellRef = newTransactionRowRef.insertCell(2);
  newTypeCellRef.textContent = transactionObj["transactionAmount"];

  newTypeCellRef = newTransactionRowRef.insertCell(3);
  newTypeCellRef.textContent = transactionObj["transactionCategory"];

  let newDeleteCell = newTransactionRowRef.insertCell(4);
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Eliminar";
  newDeleteCell.appendChild(deleteButton);

  deleteButton.addEventListener("click", (event) => {
    let transactionRow = event.target.parentNode.parentNode;
    let transactionId = transactionRow.getAttribute("data-transaction-id");
    transactionRow.remove();
    deleteTransactionObj(transactionId);
  });
}

//Le paso como parametro el transactioId de la transaccion quem quiero eliminar
function deleteTransactionObj(transactionId) {
  //Obtengo las transaccion de mi base de datos(Desconvierto de JSON a Objeto)
  let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"));
  //Busco el indice / la posicion de la transaccion que quiero eliminar
  let transacctionIndexInArray = transactionObjArr.findIndex(
    (element) => element.transactionId == transactionId
  );
  //Elimino el elementode esa posicion
  transactionObjArr.splice(transacctionIndexInArray, 1);
  // Convierto de Objeto a JSON
  let transacctionArrayJSON = JSON.stringify(transactionObjArr);
  //Guardo mi array de tracsaccion en formato JSON en el local Storage
  localStorage.setItem("transactionData", transacctionArrayJSON);
}

function saveTransactionObj(transactionObj) {
  let myTransactionArray =
    JSON.parse(localStorage.getItem("transactionData")) || [];

  console.log(myTransactionArray);
  //myTransactionArray.prototype.push(transactionObj);
  Array.prototype.push.call(myTransactionArray, transactionObj);
  //Convierto mi array de transaccion a JSON
  let transactionArrayJSON = JSON.stringify(myTransactionArray);
  //guardo mi array de transaccion en formato JSON en el local storage
  localStorage.setItem("transactionData", transactionArrayJSON);
}
