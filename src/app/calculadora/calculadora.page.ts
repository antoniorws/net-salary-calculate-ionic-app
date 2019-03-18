import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.page.html',
  styleUrls: ['./calculadora.page.scss'],
})
export class CalculadoraPage implements OnInit {

  value:string = "";
  disableDot:boolean = false;
  typeInput:string = "";
  result : string = "";
  salarioLiquido = null;
  inss = null;
  percInss = null;
  totalDesconto = null;
  ir = null;
  percIr = null;

  constructor(private navParams: NavParams, private popover: PopoverController) { 
    
  }

  ngOnInit() {

    this.typeInput = this.navParams.get('tipoInput');
    this.salarioLiquido = this.navParams.get('salarioLiquido');
    this.inss = this.navParams.get('inss');
    this.percInss = this.navParams.get('percInss');
    this.totalDesconto = this.navParams.get('totalDesconto');
    this.ir = this.navParams.get('ir');
    this.percIr = this.navParams.get('percIr');

    if(this.navParams.get('tipoInput') == "result"){
      this.hideCalculadora();
      this.salarioLiquido = this.maskReal(this.salarioLiquido);
      this.inss = this.maskReal(this.inss);
      this.ir = this.maskReal(this.ir);
      this.totalDesconto = this.maskReal(this.totalDesconto);
      {document.getElementById('salarioLiquido').innerHTML =  "R$ "+this.salarioLiquido;}
      {document.getElementById('inss').innerHTML =  "R$ "+this.inss;}
      {document.getElementById('percInss').innerHTML =  this.percInss;}
      {document.getElementById('totalDesconto').innerHTML =  "R$ "+this.totalDesconto;}
      if(this.ir == 0){
        {document.getElementById('impostoDeRenda').innerHTML =  "Isento";}
        {document.getElementById('percIr').innerHTML =  "";}
      }else{
        {document.getElementById('impostoDeRenda').innerHTML =  "R$ "+this.ir;}
        {document.getElementById('percIr').innerHTML =  this.percIr;}
      }
    }else{
      this.showCalculadora();
      if(this.typeInput == "salarioBruto" || this.typeInput == "jornadaMensal" || this.typeInput == "adicionalHoraExtra"
            || this.typeInput == "numeroHoraExtra"){
        document.getElementById('value').style.color = "#095528";
      }
    }
  }

  showCalculadora(){
    document.getElementById('divResult').style.visibility = "hidden";
    document.getElementById('divResult').style.position = "absolute";
    document.getElementById('divCalculadora').style.visibility = "visible";
    document.getElementById('divCalculadora').style.position = "relative";
  }

  hideCalculadora(){
    document.getElementById('divCalculadora').style.visibility = "hidden";
    document.getElementById('divCalculadora').style.position = "absolute";
    document.getElementById('divResult').style.visibility = "visible";
    document.getElementById('divResult').style.position = "relative";
  }

  //close the popover Calculadora
  closePopover(){
    this.popover.dismiss("close");
  }

  btnCompleted(){
    this.popover.dismiss(this.value,"completed");
  }

  //Show value of button in the input
  showBtn(valueBtn:string){
    if(this.value == "" && valueBtn != "."){
      this.value = valueBtn;
    }else if((this.value == "" && valueBtn == ".") || (this.value.endsWith(".") && valueBtn == ".") 
                || (valueBtn == "." && this.disableDot == true) 
                  || (this.value.substring(this.value.length-3, this.value.length-2) == ".")){
      //do nothing
    }else{
      if(valueBtn == "."){
        this.disableDot = true;
      }
      this.value = this.value + valueBtn;
    }
  }

  //Delete input
  delete(){
    if(this.value != ""){
      if(this.value.endsWith(".")){
        this.disableDot = false;
      }
      this.value = this.value.substring(0, this.value.length - 1);
    }
  }

  maskReal(value:string):string{
    if(value != "" || value != null){
      if("." == value.substring(value.length-3, value.length-2)){
        value = value.substring(0, value.length-3) + ","+value.substring(value.length-2);
      }else if("." == value.substring(value.length-2, value.length-1)){
        value = value.substring(0, value.length-2) + ","+value.substring(value.length-1) + "0";
      }else if("." == value.substring(value.length-1, value.length)){
        value = value.substring(0, value.length-1) + ","+value.substring(value.length) + "00";
      }else{
        value = value + ",00"
      }
      if(value.length-3 >= 4){
        value = value.substring(0, value.length - 6) + "." + value.substring(value.length - 6);
        if(value.length-3 >= 8){
          value = value.substring(0, value.length - 10) + "." + value.substring(value.length - 10);
          if(value.length-3 >= 12){
            value = value.substring(0, value.length - 14  ) + "." + value.substring(value.length - 14);
          }
        }
      }
      return value;
    }
  }

}
