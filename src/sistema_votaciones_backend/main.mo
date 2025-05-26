import Array "mo:base/Array";

actor SistemaVotacion {

    // TIPOS
    type Candidato = {
        id: Text;
        nombre: Text;
        partido: Text; // Azul, Verde, Amarillo, Guinda
        cargo: Text;   // Presidente, Diputado, Senador
        votos: Nat;
    };
    // Tipo que servirá para recibir los votos seleccionados
    type Voto = {
        presidente: Text;
        diputado: Text;
        senador: Text;
    };

    // CANDIDATOS 
      stable var candidatos : [Candidato] = [
        // Presidentes
        {id="P1"; nombre="Juan Pérez"; partido="Azul"; cargo="Presidente"; votos=0},
        {id="P2"; nombre="María López"; partido="Verde"; cargo="Presidente"; votos=0},
        {id="P3"; nombre="Carlos García"; partido="Amarillo"; cargo="Presidente"; votos=0},
        {id="P4"; nombre="Ana Martínez"; partido="Guinda"; cargo="Presidente"; votos=0},

        // Diputados
        {id="D1"; nombre="Pedro Sánchez"; partido="Azul"; cargo="Diputado"; votos=0},
        {id="D2"; nombre="Laura Díaz"; partido="Verde"; cargo="Diputado"; votos=0},
        {id="D3"; nombre="Miguel Ángel"; partido="Amarillo"; cargo="Diputado"; votos=0},
        {id="D4"; nombre="Sofía Castro"; partido="Guinda"; cargo="Diputado"; votos=0},

        // Senadores
        {id="S1"; nombre="Roberto Jiménez"; partido="Azul"; cargo="Senador"; votos=0},
        {id="S2"; nombre="Patricia Núñez"; partido="Verde"; cargo="Senador"; votos=0},
        {id="S3"; nombre="Fernando Ruiz"; partido="Amarillo"; cargo="Senador"; votos=0},
        {id="S4"; nombre="Lucía Méndez"; partido="Guinda"; cargo="Senador"; votos=0}
    ];

    stable var votantesRegistrados : [Text] = [];

    // FUNCIONES
    // Consulta el id ingresado en la lista votantesRegistrados
    public func yaVoto(idINE : Text) : async Bool {
        switch (Array.find<Text>(votantesRegistrados, func(x) { x == idINE })) {
            case null { return false };
            case (?_) { return true };
        }
    };

    // Permite el filtrado de los candidatos por cargo para su selección
    public func getCandidatosPorCargo(cargo : Text) : async [Candidato] {
        return Array.filter<Candidato>(candidatos, func(c) = c.cargo == cargo);
    };

    // Llama a yaVoto y emite mensaje según corresponda y verifica se completen las votaciones
    public func votar(idINE : Text, voto : Voto) : async Text {
        let yaVotoRes : Bool = await yaVoto(idINE);
        if (yaVotoRes) {
            return "Ya has votado anteriormente.";
        };
        // Verifica se complete la votación de cada cargo
        if (voto.presidente == "" or voto.diputado == "" or voto.senador == "") {
            return "Debes seleccionar un candidato en cada categoría.";
        };
        
        // Realiza la suma de los votos según el candidato seleccionado
        candidatos := Array.map<Candidato, Candidato>(candidatos, func(c : Candidato) : Candidato =
            if (c.id == voto.presidente or c.id == voto.diputado or c.id == voto.senador) {
                { c with votos = c.votos + 1 }
            } else {
                c
            }
        );

        // Agrega el idINE a la lista votantesRegistrados
        votantesRegistrados := Array.append<Text>(votantesRegistrados, [idINE]);

        return "¡Tu voto ha sido registrado exitosamente!";
    };
    // Devuelve la lista de candidatos completa para ser consumida por el front y mostrar votos
    public func getResultados() : async [Candidato] {
    return candidatos;
    };
};