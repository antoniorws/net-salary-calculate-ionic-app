import { Component } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig} from '@ionic-native/admob-free/ngx';
import { NavController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public navCtrl : NavController, public admobFree: AdMobFree, private statusBar : StatusBar) {
    this.showInterstitialAd();
    this.showBannerAd();
    this.statusBar.overlaysWebView(true);
    this.statusBar.backgroundColorByHexString('#ffffff');
  }
  
  salarioLiquido = null;
  inss = null;
  percInss = "";
  ir = null;
  percIr = "";
  salarioAnual = null;
  totalDesconto = null;

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

  calcular(salarioBruto:number, outrosDescontos:number, valor:string, planoSaude:number, pensaoAlimenticia:number, 
    descontoTransporte:number){
    
    descontoTransporte = null;
    if(valor == "6"){
      descontoTransporte = salarioBruto * 0.06;
    }
    this.validaInss(salarioBruto);
    this.validaIR(salarioBruto);
    this.salarioLiquido = salarioBruto - (this.inss + this.ir);
    this.ir = this.ir.toFixed(2);
    this.inss = this.inss.toFixed(2);
    this.salarioLiquido = this.salarioLiquido - (outrosDescontos != null ? outrosDescontos : 0);
    this.salarioLiquido = this.salarioLiquido - (descontoTransporte != null ? descontoTransporte : 0);
    this.salarioLiquido = this.salarioLiquido - (planoSaude != null ? planoSaude : 0);
    this.salarioLiquido = this.salarioLiquido - (pensaoAlimenticia != null ? pensaoAlimenticia : 0);
    this.salarioLiquido = this.salarioLiquido.toFixed(2);
    this.totalDesconto = salarioBruto - this.salarioLiquido;
    this.totalDesconto = this.totalDesconto.toFixed(2);
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
  }

  limpar(){
    {document.getElementById('salarioLiquido').innerHTML =  "";}
    {document.getElementById('inss').innerHTML =  "";}
    {document.getElementById('percInss').innerHTML =  "";}
    {document.getElementById('impostoDeRenda').innerHTML =  "";}
    {document.getElementById('percIr').innerHTML =  "";}
    {document.getElementById('totalDesconto').innerHTML =  "";}
    
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

}
