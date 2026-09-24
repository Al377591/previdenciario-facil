
function showPage(id){
  const target = document.getElementById(id);
  if(!target) return;
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  target.classList.add("active");

  document.querySelectorAll(".bottom-nav button").forEach(b=>b.classList.remove("active"));
  const map={inicio:0,aposentadoria:1,pesquisa:2,cnis:3,guia:4,beneficios:0,inss:4};
  const bs=document.querySelectorAll(".bottom-nav button");
  if(bs[map[id]]!==undefined) bs[map[id]].classList.add("active");

  window.scrollTo({top:0,behavior:"smooth"});
}

function abrirExterno(url){
  window.open(url, "_blank", "noopener,noreferrer");
}

function idadeEm(data,ref=new Date()){
  const d=new Date(data+"T00:00:00");
  let i=ref.getFullYear()-d.getFullYear();
  const m=ref.getMonth()-d.getMonth();
  if(m<0||(m===0&&ref.getDate()<d.getDate()))i--;
  return i;
}

function calcular(){
  const n=document.getElementById("nascimento").value;
  const s=document.getElementById("sexo").value;
  const t=parseFloat(document.getElementById("tempo").value||0);
  const r=document.getElementById("resultado");

  if(!n||!s||isNaN(t)){
    r.classList.remove("hidden");
    r.innerHTML="<b>Preencha os campos obrigatórios.</b>";
    return;
  }

  const idade=idadeEm(n);
  const im=s==="F"?62:65;
  const tm=s==="F"?15:20;
  const fi=Math.max(0,im-idade);
  const ft=Math.max(0,tm-t);

  r.classList.remove("hidden");
  r.innerHTML=`<h3>Resultado inicial</h3>
    <p><b>Idade:</b> ${idade} anos</p>
    <p><b>Contribuição informada:</b> ${t.toFixed(1)} anos</p>
    <p><b>Referência simplificada:</b> ${im} anos de idade e ${tm} anos de contribuição.</p>
    <p><b>Diferença:</b> ${fi} ano(s) de idade e ${ft.toFixed(1)} ano(s) de contribuição.</p>
    <small>Simulação didática. Não determina direito adquirido. Regras de transição, pontos, pedágios, carência e períodos especiais exigem análise específica.</small>`;
}

function filtrarBeneficios(q){
  document.querySelectorAll(".benefit").forEach(x=>{
    x.style.display=x.innerText.toLowerCase().includes(q.toLowerCase())?"flex":"none";
  });
}

let periodos=[];

function adicionarPeriodo(){
  const a=document.getElementById("ini").value;
  const b=document.getElementById("fim").value;
  const e=document.getElementById("empresa").value||"Não informado";
  const o=document.getElementById("obs").value||"";

  if(!a||!b||new Date(b)<new Date(a)){
    alert("Informe um período válido.");
    return;
  }
  periodos.push({a,b,e,o});
  render();
}

function dias(a,b){
  return Math.floor((new Date(b)-new Date(a))/86400000)+1;
}

function render(){
  const box=document.getElementById("tabelaCnis");
  box.innerHTML="";
  let total=0;

  periodos.forEach((p,i)=>{
    total+=dias(p.a,p.b);
    box.innerHTML+=`<div class="period">
      <div class="row">
        <div><b>${p.e}</b><small>${p.a} → ${p.b}</small></div>
        <button class="del" onclick="remover(${i})">Excluir</button>
      </div>
      <small>${p.o}</small>
    </div>`;
  });

  document.getElementById("totalCnis").innerHTML=
    `<b>${periodos.length}</b> período(s) · aproximadamente <b>${(total/365.25).toFixed(2)} anos</b> de tempo bruto cadastrado.`;
}

function remover(i){
  periodos.splice(i,1);
  render();
}
