let vokabel = JSON.parse(localStorage.getItem("vokabel")) || [];    //vokabel wird entweder in ls oder leerer liste gesucht 
let currentIndex = 0;                                               //gibt position der vokabel im array an (die wievielte vokabel es ist)
let score = 0;
let geklickt = false

function hinzufügen() {
    geklickt = false
    let deutschesWort = document.getElementById("idDW").value;
    let übersetzung = document.getElementById("idEW").value;
    if (deutschesWort && übersetzung) {                             //wenn ein deutsches wort und eine überetzung eingegeben wurde...
        vokabel.push({ deutschesWort, übersetzung });               //die eingegebenen wörter (vokabel) werden in die vokabelliste eingefügt
        localStorage.setItem("vokabel", JSON.stringify(vokabel));   //=> variablen "deutschesWort" und "übersetzung" können als string nicht
        document.getElementById("idDW").value = "";                 //   gespeichert werden; sie müssen also in ein Objekt umgewandelt werden
        document.getElementById("idEW").value = "";
        updateVL();
        showVL()
    }
}

function updateVL() {
    const list = document.getElementById("idVokabelListe");
    list.innerHTML = "";                                                        //liste wird zum aktualisieren zunächst geleert um doppelte einträge zu verhindern
    vokabel.forEach((entry, wort) => {                                          //folgendes wird für jede vokabel ausgeführt
        const li = document.createElement("li");                                //<li>-element wird erstellt
        li.textContent = `${entry.deutschesWort} - ${entry.übersetzung}`;       //inhalt des jeweiligen <li> ist eingegebenes deutsches wort und übersetzung
        li.style.display = "flex"                                               //<li>-item wird sichtbar gemacht
        const deleteButton = document.createElement("button");                  //<button> zum löschen der jeweiligen vokabel wird erstellt 
        deleteButton.innerHTML = "Löschen";                                     
        deleteButton.classList.add("deleteBtn")                                 //dem lösch-button wird die css-klasse "deleteBtn" hinzugefügt
        deleteButton.onclick = () => wortLöschen(wort);                         //beim klicken des buttons wird funktion wortLöschen() aufgerufen mit parameter
        li.appendChild(deleteButton);                                           //lösch-button wird dem <li>-element als child hinzugefügt
        list.appendChild(li);                                                   //<li>-element (welches button enthält) wird der gesamten liste hinzugefügt
    });
}

function showVL(){
    const list = document.getElementById("idVokabelListe")
    const li = document.querySelectorAll("li")                                  //jedes existierende <li>-element wird aufgerufen
    if(!geklickt){                                                              //wenn variable "geklickt" noch auf false gesetzt ist (oben deklariert)...
        list.style.display = "block"                                            //komplette liste wird untereinander angezeigt
        li.forEach(li => {                                                      //jedes <li>-element...
            li.style.display = "flex"                                           //wird in einer reihe angezeigt
        })
        geklickt = true                                                         //"geklickt" wird auf true gesetzt (damit man liste immer wieder ein- und ausblenden kann)
    }
    else{                                                                       //wenn "geklickt" nicht auf false ist...
        list.style.display = "none"                                             //komplette liste wird ausgeblendet und...
        li.forEach(li => {                                                      //jedes <li>-element...
            li.style.display = "none"                                           //wird ausgeblendet
        })
        geklickt = false                                                        //"geklickt" wird wieder auf false gesetzt
    }
}

function wortLöschen(wort) {
    geklickt = false                                                     //"geklickt" wird auf false gesetzt, damit durch showVL() die liste weiterhin angezeigt wird
    vokabel.splice(wort, 1);                                             //wort = jeweiliges wort, das man löschen will, 1 = man will nur genau ein wort löschen
    localStorage.setItem("vokabel", JSON.stringify(vokabel));            //der lokale speicher merkt sich, dass die vokabel gelöscht wurde
    updateVL();                                                          
    showVL()
}

function testStarten() {
    if (vokabel.length == 0) {                                              //wenn noch gar keine vokabeln gespeichert wurden...
        alert("Keine Vokabeln gespeichert!");                               //wird man darüber informiert :)
        return;                                                             //return = schleife wird sofort beendet wenn bedingung zutrifft
    }
    else{                                                                   //wenn doch vokabeln gespeichert wurden...
        document.getElementById("vokabelTest").style.display = "block";     //wird der "vokabeltest" angezeigt
        currentIndex = 0;                                                   //es wird festgelegt, dass gleich die ERSTE vokabel abgefragt wird
        score = 0;                                                          //score wird zu beginn auf 0 gesetzt
        frage();                    
    }
}

const antwort = document.getElementById("idAntwort")                          

function frage() {
    document.getElementById("idFrage").innerText = `Übersetze: "${vokabel[currentIndex].deutschesWort}"`;
    antwort.value = "";                         //bei jeder neuen frage wird das antwortfeld mit der von vorher enthaltenen vokabel geleert
}  

function kontrollieren() {
    if (antwort.value == vokabel[currentIndex].übersetzung) {        //wenn antwort richtig ist...
        score++;                                                     //wird die punktzahl um 1 erhöht
    }
    if (currentIndex + 1 < vokabel.length) {                         //wenn momentane abgefragte vokabel noch nicht die letzte ist...   
        currentIndex++;                                              
        frage();                                                     //nächste frage
    }
    else {                                                           //wenn abgefragte vokabel die letzte in der liste war...
        if (score < (vokabel.length/2)){                             //...und man weniger als die hälfte richtig hatte...
            alert(`Test beendet! Deine Punktzahl: ${score} / ${vokabel.length}\nDa geht noch mehr!`);   //wird man "motiviert"
        }

        else if ((vokabel.length/2) < score && score < vokabel.length) {           //...und man mehr als die hälfte aber nicht alle richtig hatte...         
            alert(`Test beendet! Deine Punktzahl: ${score} / ${vokabel.length}\nGut!`);     //wird man gelobt
        }
        else if (score = vokabel.length){                                          //...und man alle richtig hatte...
            alert(`Test beendet! Deine Punktzahl: ${score} / ${vokabel.length}\nSehr Gut!`);    //wird man noch mehr gelobt
        }
        document.getElementById("vokabelTest").style.display = "none";      //vokabeltest wird ausgeblendet
    }
}

antwort.addEventListener("keydown", function(e){                    //keydown listener prüft, ob...
    if(e.key === "Enter")                                           //enter auf der tastatur gedrückt wurde...
        kontrollieren()                                             //und führt dann auch kontrollieren() aus
}) 

updateVL();                                                          //nochmal globales aufrufen der updateVL() funktion, um sicher zu gehen,
                                                                     //dass liste jedes mal nach starten der website aktualisiert wird
