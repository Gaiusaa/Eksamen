IT Eksamen 2025
Informasjon
Kandidat: Gaius
Dato: 02.06 .25 – 04.06.25
Alias: Kraken
Pool: 87
Subdomene: kraken.ikt-fag.no
Repository: https://github.com/Gaiusaa/Eksamen
API: http://side.kraken.ikt-fag.no

Forberedelse
Som forberedelse har jeg utviklet et RESTful API-tjeneste med Express.js. API-et henvender seg mot bruker-håndtering og autentisering via /api ruten. Dette API’et kjører på en Linux VM i VMWare der den er tilgjengelig for bruk gjennom et domenenavn og har en tilkobling til en database.

API-et kjører i et isolert miljø sammen med to ander VM’er. API kjører internt på localhost og bruker Caddy is sammenheng med den andre serveren, DNS og Bind9 for domenenavn som bruker reverse_proxy for å nå API’et. API’et tar også i bruk MongoDB, en NoSQL database som kjører på den siste serveren og håndterer alle brukere med collection «users».

Eksamen
Eksamen har gått ut på å utvikle to nye ruter, og sette opp et domenenavn for API’et. Rutene demonstrerer hvordan brukere opprettes og søkes etter fra databasen til API’et. Domenenavnet skal være eksamen.kraken.ikt-fag.no, men desverre for en ukjent grunn var jeg ikke i stand til å fulløre dette. I stedet, fikk jeg til å gi den domenenavnet side.kraken.ikt-fag.no.