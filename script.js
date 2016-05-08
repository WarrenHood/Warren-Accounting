function gid(x){return document.getElementById(x);}
accountsN = ['capital','drawings','land and buildings','vehicles','equipment','trading stock','debtors control','bank','cash float','fixed deposit:pride bank','creditors control','loan:good bank','sales','cost of sales','debtors allowance','stationery','wages','advertising','bank charges','packing materials','discount allowed','rent income','discount received','telephone','water and electricity'];
sides = [1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0];
function initAccs(){
	for(var i = 0;i < accountsN.length;i++)addAccount(accountsN[i],['Dr','Cr'][sides[i]],0);
}
function bringDown(){
	for(var i = 0; i < accounts.length;i++){
		a = accounts[i];
	if(a[1] == 'Dr')dtransact(a[0],'balance b/d',a[2]);
		else ctransact('balance b/d',a[0],a[2]);
	}
}
window.onload = function(){
	initAccs();
	gid('drawgl').onclick = dumpAccs;
	get('crj','addsun').onclick = suncrj;
	get('cpj','addsun').onclick = suncpj;
	get('cj','addsun').onclick = suncj;
	get('caj','addsun').onclick = suncaj;
	gid('addAcc').onclick = function(){
		var side = 0;
		var types = document.getElementsByClassName('t');
		for(var i = 0;i<types.length;i++)if(types[i].checked)side = i;
		if(side < 3)side = 'Dr';
		else side = 'Cr';
		addAccount(gid('accName').value,side,gid('val').value);
	}
}
accounts = [];
function addAccount(name,side,value){
	var found = false;
	for(var i = 0;i < accounts.length;i++)if(accounts[i][0] == name){found = true;accounts[i] = [name,side,value,[],[]];}
	if(!found)accounts.push([name,side,value,[],[]]);
	updateAccounts();
}
function updateAccounts(){
	var table = '<table><tr><td>Account</td><td>Side</td><td>Value</td></tr>';
	for(var i = 0;i < accounts.length;i++)table += '<tr><td>'+accounts[i][0]+'</td><td>'+accounts[i][1]+'</td><td>'+accounts[i][2]+'</td><tr>';
	table += '</table>';
	gid('accounts').innerHTML = table;
}
function get(jrn,acc){return gid(jrn).getElementsByClassName(acc)[0];}
function findAcc(name){
	var found = false;
	for(var i = 0;i < accounts.length;i++)if(accounts[i][0] == name){return accounts[i];found = true;}
	if(!found){addAccount(name,cSide,0,[],[]);
	return accounts[accounts.length - 1];}
}
crjsun = [];
cpjsun = [];
cjsun = [];
cajsun = [];

function suncrj(){
	console.log('Inside suncrj');
	var val = bigInt(get('crj','sundryamnt').value);
	var det = get('crj','sundrydet').value;
	console.log(val + ' ' + det);
	var array = [];
	array.push(val);
	array.push(det);
	crjsun.push(array);
	var table = '<table><tr><td>Amount</td><td>Details</td></tr>';
	for(var i = 0;i<crjsun.length;i++)table += '<tr><td>'+crjsun[i][0]+'</td><td>'+crjsun[i][1]+'</td></tr>';
	table += '</table>';
	get('crj','sundrys').innerHTML = table;
}

function suncpj(){
	var val = bigInt(get('cpj','sundryamnt').value);
	var det = get('cpj','sundrydet').value;
	var array = [];
	array.push(val);
	array.push(det);
	cpjsun.push(array);
	var table = '<table><tr><td>Amount</td><td>Details</td></tr>';
	for(var i = 0;i<cpjsun.length;i++)table += '<tr><td>'+cpjsun[i][0]+'</td><td>'+cpjsun[i][1]+'</td></tr>';
	table += '</table>';
	get('cpj','sundrys').innerHTML = table;
}

function suncj(){
	var val = bigInt(get('cj','sundryamnt').value);
	var det = get('cj','sundrydet').value;
	var array = [];
	array.push(val);
	array.push(det);
	cjsun.push(array);
	var table = '<table><tr><td>Amount</td><td>Details</td></tr>';
	for(var i = 0;i<cjsun.length;i++)table += '<tr><td>'+cjsun[i][0]+'</td><td>'+cjsun[i][1]+'</td></tr>';
	table += '</table>';
	get('cj','sundrys').innerHTML = table;
}

function suncaj(){
	var val = bigInt(get('caj','sundryamnt').value);
	var det = get('caj','sundrydet').value;
	var array = [];
	array.push(val);
	array.push(det);
	cajsun.push(array);
	var table = '<table><tr><td>Amount</td><td>Details</td></tr>';
	for(var i = 0;i<cajsun.length;i++)table += '<tr><td>'+cajsun[i][0]+'</td><td>'+cajsun[i][1]+'</td></tr>';
	table += '</table>';
	get('caj','sundrys').innerHTML = table;
}
function transact(d,c,v){
	console.log('debit:'+d+' Credit:'+c+' value:'+v);
	var deb = findAcc(d);
	var cred = findAcc(c);
	deb[3].push([c,bigInt(v)]);
	cred[4].push([d,bigInt(v)]);
}
function dtransact(d,c,v){
	console.log('debit:'+d+' Credit:'+c+' value:'+v);
	var deb = findAcc(d);
	deb[3].push([c,bigInt(v)]);
}
function ctransact(d,c,v){
	console.log('debit:'+d+' Credit:'+c+' value:'+v);
	var cred = findAcc(c);
	cred[4].push([d,bigInt(v)]);
}

function crj(){
	cSide = 'Cr';
	var bank = get('crj','bank').value;
	dtransact('bank','Sundry Accounts',bank);
	var sales = get('crj','sales').value;
	ctransact('bank','sales',sales);
	var cos = get('crj','cos').value;
	transact('cost of sales','trading stock',cos);
	var debcont = get('crj','debcont').value;
	ctransact('bank','debtors control',debcont);
	var disall = get('crj','disall').value;
	transact('discount allowed','debtors control',disall);
	for(var i = 0;i < crjsun.length;i++)ctransact('bank',crjsun[i][1],crjsun[i][0]);
}
function cpj(){
	cSide = 'Dr';
	var bank = get('cpj','bank').value;
	ctransact('Sundry Accounts','bank',bank);
	var ts = get('cpj','ts').value;
	dtransact('trading stock','bank',ts);
	var wages = get('cpj','wages').value;
	dtransact('wages','bank',wages);
	var credcont = get('cpj','credcont').value;
	dtransact('creditors control','bank',credcont);
	var disrec = get('cpj','disrec').value;
	transact('creditors control','discount received',disrec);
	for(var i = 0;i < cpjsun.length;i++)dtransact(cpjsun[i][1],'bank',cpjsun[i][0]);
}
function dj(){
	var sales = get('dj','sales').value;
	transact('debtors control','sales',sales);
	var cos = get('dj','cos').value;
	transact('cost of sales','trading stock',cos);
	
}
function daj(){
	var deball = get('daj','deball').value;
	transact('debtors allowance','debtors control',deball);
	var cos = get('daj','cos').value;
	transact('trading stock','cost of sales',cos);
}
function cj(){
	cSide = 'Dr';
	var credcont = get('cj','credcont').value;
	ctransact('Sundry Accounts','creditors control',credcont);
	for(var i = 0;i < cjsun.length;i++)dtransact(cjsun[i][1],'creditors control',cjsun[i][0]);
	
}
function caj(){
	cSide = 'Cr';
	var credcont = get('caj','credcont').value;
	dtransact('creditors control','Sundry Accounts',credcont);
	for(var i = 0;i < cajsun.length;i++)ctransact('creditors control',cajsun[i][1],cajsun[i][0]);
}
function sumDr(a){
	var sum = 0;
	for(var i = 0; i < a[3].length;i++)sum += bigInt(a[3][i][1]);
	return sum;
}
function sumCr(a){
	var sum = 0;
	for(var i = 0; i < a[4].length;i++)sum += bigInt(a[4][i][1]);
	return sum;
}
function balance(){
	for(var i = 0;i < accounts.length;i++){
		var a = accounts[i];
		var diff = bigInt(sumDr(a)) - bigInt(sumCr(a));
		if(diff > 0){dtransact(a[0],'balance b/d',diff);balances.push([diff,'Dr',a[0]])}
		else if(diff < 0){ctransact('balance b/d',a[0],Math.abs(diff));balances.push([Math.abs(diff),'Cr',a[0]]);}
		else if(a[1] == 'Dr'){dtransact(a[0],'balance b/d',diff);balances.push([diff,'Dr',a[0]])}
		else {ctransact('balance b/d',a[0],Math.abs(diff));balances.push([Math.abs(diff),'Cr',a[0]]);}
	}
}
function dumpAccs(){
	bringDown();
	crj();cpj();dj();daj();cj();caj();
	balance();
	var gl = '';
	c:for(var i = 0;i < accounts.length;i++){
		var a = accounts[i];
		if((a[3].length == 0)&& (a[4].length == 0))continue c;
		var elt = '<h1>'+accounts[i][0]+'</h1><table><tr><td>Details</td><td>Amount</td><td>Details</td><td>Amount</td></tr>';
		var minDr = accounts[i][3].length;
		var minCr = accounts[i][4].length;
		var max = minDr;
		if(minCr > max)max = minCr;
		for(var j = 0;j < max;j++){
			elt += '<tr><td>';
			if(j < minDr)elt += a[3][j][0]+ '</td><td>'+a[3][j][1]+'</td>';
			else elt += '</td><td></td>';
			if(j < minCr)elt += '<td>'+a[4][j][0]+ '</td><td>'+a[4][j][1]+'</td>';
			else elt += '<td></td><td></td>';
			elt += '</tr>';
		}
		elt += '</table>';
		gl += elt;
	}
	gid('gl').innerHTML = gl;
	trialB();
}
balances = [];
function trialB(){
	var d = 0;
	var c = 0;
	var elt = '<table><tr><td>Account Name</td><td>Dr</td><td>Cr</td><tr>';
	for(var i = 0;i < balances.length;i++){
		var b = balances[i];
		elt += '<tr><td>'+ b[2]+'</td><td>';
		if(b[1] == 'Dr'){elt += b[0];d += bigInt(b[0]);}
		elt += '</td><td>';
		if(b[1] == 'Cr'){elt += b[0];c += bigInt(b[0]);}
		elt += '</td></tr>'
	}
	elt += '<tr><td>Total</td><td>'+d+'</td><td>'+c+'</td></tr>';
	elt += '</table>';
	gid('tb').innerHTML = elt;
	
}
