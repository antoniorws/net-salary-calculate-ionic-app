import { Component } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig} from '@ionic-native/admob-free/ngx';
import { NavController, PopoverController, Platform, ToastController} from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CalculadoraPage } from '../calculadora/calculadora.page';
import {File} from '@ionic-native/file/ngx'
import {SocialSharing} from '@ionic-native/social-sharing/ngx'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //Varíaveis
  salarioLiquido = null;
  inss = null;
  percInss = "";
  ir = null;
  percIr = "";
  salarioAnual = null;
  totalDesconto = null;
  salarioBruto= "";
  salarioBrutoVar:number = null;
  outrosDescontos = "";
  outrosDescontosVar = null;
  planoSaude = "";
  planoSaudeVar = null;
  pensaoAlimenticia = "";
  pensaoAlimenticiaVar = null;
  valorCalculadora = null;
  impostoDeRenda = null;
  telaDesconto = null;
  passou:boolean = false;
  ultimoValor:string = null;
  flagHoraExtra = null;
  jornadaMensal = "";
  jornadaMensalVar =null;
  adicionalHoraExtra = "";
  adicionalHoraExtraVar = null;
  numeroHoraExtra = "";
  numeroHoraExtraVar = null;
  valorHoraExtra:number = null;


  constructor(public navCtrl : NavController, public admobFree: AdMobFree, private statusBar : StatusBar,
            private popover: PopoverController, private platform : Platform, private toastController : ToastController,
            private file : File, private socialSharing : SocialSharing) {
    this.showInterstitialAd();
    this.showBannerAd();
    this.statusBar.overlaysWebView(true);
    this.statusBar.backgroundColorByHexString('#363636');

  }

  //Método para mostrar o popover Calculadora
  async mostrarCalculadora(valor:string, salarioLiquido:string, 
        inss:string, percInss:string, totalDesconto:string, ir:string, percIr:string, ){

    const popover = await this.popover.create({
      component : CalculadoraPage,
      componentProps:{
        tipoInput: valor,
        salarioLiquido : salarioLiquido,
        inss : inss,
        percInss : percInss,
        totalDesconto : totalDesconto,
        ir : ir,
        percIr : percIr
      }
    });
    await popover.present();
    
    //Ação para retornar valores ao fechar o popover
    popover.onDidDismiss()
    .then((result) => {
      this.valorCalculadora = result['data'];
      if(this.valorCalculadora != "close" && this.valorCalculadora != "" && result['role'] == "completed"){
        if(valor != "jornadaMensal" && valor != "adicionalHoraExtra" && valor != "numeroHoraExtra"){
          this.maskReal(this.valorCalculadora);
          this.valorCalculadora = "R$ "+this.valorCalculadora;
        }
        if(valor == "salarioBruto"){
          this.salarioBruto = this.valorCalculadora;
        }else if(valor == "pensaoAlimenticia"){
          this.pensaoAlimenticia = this.valorCalculadora;
        }else if(valor == "planoSaude"){
          this.planoSaude = this.valorCalculadora;
        }else if(valor == "outrosDescontos"){
          this.outrosDescontos = this.valorCalculadora;
        }else if(valor == "jornadaMensal"){
          this.jornadaMensal = this.valorCalculadora;
        }else if(valor == "adicionalHoraExtra"){
          this.adicionalHoraExtra = this.valorCalculadora;
        }else if(valor == "numeroHoraExtra"){
          this.numeroHoraExtra = this.valorCalculadora;
        }
      }
    });
  }

  clickFlagHoraExtra(){
    if(this.flagHoraExtra){
      document.getElementById('divHoraExtra').style.position = "relative";
      document.getElementById('divHoraExtra').style.visibility = "visible";
    }else{
      document.getElementById('divHoraExtra').style.position = "absolute";
      document.getElementById('divHoraExtra').style.visibility = "hidden";
    }
  }

  //Máscara de R$
  maskReal(value:string){
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
      this.valorCalculadora = value;
    }
  }

  tirarMaskReal(value:string):string{
    value = value.substring(0, value.length-3) + "." + value.substring(value.length-2);
    if(value.length-3 >= 5){
      value = value.substring(0, value.length - 7) + value.substring(value.length - 6);
      if(value.length-3 >= 8){
        value = value.substring(0, value.length - 10) + value.substring(value.length - 9);
        if(value.length-3 >= 11){
          value = value.substring(0, value.length - 13) + value.substring(value.length - 12);
        }
      }
    }
    return value;
  }

  tirarR$(value:string, input:string){
    if(input == "salarioBruto"){
      this.salarioBrutoVar = Number(this.tirarMaskReal(value.substring(3)));
    }else if(input == "pensaoAlimenticia"){
      this.pensaoAlimenticiaVar = value.substring(3);
      this.pensaoAlimenticiaVar = this.pensaoAlimenticiaVar != null || this.pensaoAlimenticiaVar != "" ? this.tirarMaskReal(this.pensaoAlimenticiaVar):"";
    }else if(input == "planoSaude"){
      this.planoSaudeVar = value.substring(3);
      this.planoSaudeVar = this.planoSaudeVar != null || this.planoSaudeVar != "" ?  this.tirarMaskReal(this.planoSaudeVar):"";
    }else if(input == "outrosDescontos"){
      this.outrosDescontosVar = value.substring(3);
      this.outrosDescontosVar = this.outrosDescontosVar != null || this.outrosDescontosVar != "" ? this.tirarMaskReal(this.outrosDescontosVar):"";
    }
  }

  validaInss(salarioBruto:number){
    if(salarioBruto == 1751.81 || salarioBruto < 1751.82){
      this.inss = salarioBruto * 0.08;
      this.percInss = "8%"
    }else if(salarioBruto > 1751.81 && salarioBruto < 2919.73){
      this.inss = salarioBruto * 0.09;
      this.percInss = "9%"
    }else if(salarioBruto > 2919.72 && salarioBruto < 5839.46){
      this.inss = salarioBruto * 0.11;
      this.percInss = "11%"
    }else if(salarioBruto > 5839.45){
      this.inss = 642.34;
      this.percInss = "Teto"
    }
  }

  validaIR(salarioBruto:number){
    this.salarioAnual = (salarioBruto - this.inss) * 12;
    if(this.salarioAnual <= 22847.76) {
      this.ir = 0;
      this.percIr = "Isento";
    }else if(this.salarioAnual >= 22847.77 && this.salarioAnual <= 33919.80){
      this.ir = (salarioBruto - this.inss)  * 0.075 - 142.8;
      this.percIr = "7,5%";
    }else if(this.salarioAnual >= 33919.81 && this.salarioAnual <= 45012.60){
      this.ir = (salarioBruto - this.inss) * 0.15 - 354.8;
      this.percIr = "15%";
    }else if(this.salarioAnual >= 3751.06 && this.salarioAnual <= 4664.68){
      this.ir = (salarioBruto - this.inss) * 0.225 - 636.13;
      this.percIr = "22,5%";
    }else if(this.salarioAnual > 4664.68){
      this.ir = (salarioBruto - this.inss) * 0.275 - 869.36;
      this.percIr = "27,5%";
    }
  }

  async presentToast(tipoToast:String) {
    const toast = await this.toastController.create({
      message: tipoToast == "horaExtra" ? 'Não foi possível calcular a hora extra!' : 'Preencha o salário Bruto!',
      duration: 2000
    });
    toast.present();
  }

  calculaHoraExtra(quantidade:number, jornada:number, adicional:number, salario:number){
    salario = ( quantidade * (salario / jornada * (1 + (adicional/100))));
    this.salarioBrutoVar = this.salarioBrutoVar + salario;
  }

  async calcular(valor:string, descontoTransporte:number){
    if(this.salarioBruto != ""){
      this.tirarR$(this.salarioBruto, "salarioBruto");
      if(this.flagHoraExtra && this.jornadaMensal != "" && this.numeroHoraExtra != "" && this.adicionalHoraExtra != ""){        
        this.calculaHoraExtra(Number(this.numeroHoraExtra), Number(this.jornadaMensal), Number(this.adicionalHoraExtra), this.salarioBrutoVar);
        this.salarioBrutoVar = Number(this.salarioBrutoVar.toFixed(2));
      }else if (this.flagHoraExtra){  
        await this.presentToast("horaExtra");
      }
      this.pensaoAlimenticia != "" ? this.tirarR$(this.pensaoAlimenticia, "pensaoAlimenticia") : "" ;
      this.planoSaude != ""  ? this.tirarR$(this.planoSaude, "planoSaude") : "" ;
      this.outrosDescontos != "" ? this.tirarR$(this.outrosDescontos, "outrosDescontos") : "" ;

      descontoTransporte = null;
      
      if(valor == "6"){
        descontoTransporte = this.salarioBrutoVar * 0.06;
      }
      this.validaInss(this.salarioBrutoVar);
      this.validaIR(this.salarioBrutoVar);
      this.salarioLiquido = this.salarioBrutoVar - (this.inss + this.ir);
      this.ir = this.ir.toFixed(2);
      this.inss = this.inss.toFixed(2);
      this.salarioLiquido = this.salarioLiquido - (this.outrosDescontosVar != null || this.outrosDescontos !="" ? this.outrosDescontosVar : 0);
      this.salarioLiquido = this.salarioLiquido - (descontoTransporte != null || String(descontoTransporte) != "" ? descontoTransporte : 0);
      this.salarioLiquido = this.salarioLiquido - (this.planoSaudeVar != null || this.planoSaudeVar != "" ? this.planoSaudeVar : 0);
      this.salarioLiquido = this.salarioLiquido - (this.pensaoAlimenticiaVar != null || this.pensaoAlimenticiaVar != "" ? this.pensaoAlimenticiaVar : 0);
      this.salarioLiquido = this.salarioLiquido.toFixed(2);
      this.totalDesconto = this.salarioBrutoVar - this.salarioLiquido;
      this.totalDesconto = this.totalDesconto.toFixed(2);
      await this.mostrarCalculadora("result", this.salarioLiquido, this.inss, this.percInss, this.totalDesconto, this.ir, this.percIr);
    }else{
      await this.presentToast(null);
    }
  }

  limpar(){
    this.salarioBruto = "";
    this.salarioBrutoVar = null;
    this.pensaoAlimenticia = "";
    this.pensaoAlimenticiaVar = null;
    this.planoSaude = "";
    this.planoSaudeVar = null;
    this.outrosDescontos = "";
    this.outrosDescontosVar = null;
    this.numeroHoraExtra = "";
    this.numeroHoraExtraVar = null;
    this.jornadaMensal = "";
    this.jornadaMensalVar = null;
    this.adicionalHoraExtra = "";
    this.adicionalHoraExtraVar = null;
  }

  showBannerAd() {
    let bannerConfig: AdMobFreeBannerConfig = {
        autoShow: true,
        id : "ca-app-pub-4194830459217632/2995904010"
    };
    this.admobFree.banner.config(bannerConfig);
    this.admobFree.banner.prepare()
    .then(() => {
    }).catch(e => alert(e));
  }

  showInterstitialAd() {
    let InterstitialConfig: AdMobFreeInterstitialConfig = {
        autoShow: true,
        id : "ca-app-pub-4194830459217632/5650089146"
    };
    this.admobFree.interstitial.config(InterstitialConfig);
    this.admobFree.interstitial.prepare()
    .then(() => {
    }).catch(e => alert(e));
  }

  shareWhatsapp(){
    this.socialSharing.shareViaWhatsApp("App para Cálculo de Salário Líquido",
      null, "https://play.google.com/store/apps/details?id=io.SalarioLiquidoSerrasWanderley").then(()=>{

    }).catch(e => {

    })
  }

  shareFacebook(){
    this.socialSharing.shareViaFacebook("App para Cáculo de Salário Líquido", 
      null, "https://play.google.com/store/apps/details?id=io.SalarioLiquidoSerrasWanderley" ).then(() =>{

    }).catch(e =>{

    })
  }

}
