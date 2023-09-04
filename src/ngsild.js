exports.ngsild = class NGSILD {
  constructor(id, type, properties, relationships) {
    this.id = id;
    this.type = type;
    this.properties = properties;
    this.relationships = relationships;
    //this.context = context;
  }

  // Generare entità NGSILD
  generateEntity() {
    var entity = {
      id: this.id,
      type: this.type,
      //"@context": this.context
    };

    for (let i = 0; i < this.properties.length; i++) {
      const prop = this.properties[i];
      entity[prop.name] = prop.value;
    }

    for (let i = 0; i < this.relationships.length; i++) {
      const rel = this.relationships[i];
      entity[rel.name] = rel.value;
    }

    /*
      // Esempio di proprietà
      const color = {
        name : "color",
        value : {
          "type": "Property",
          "value": "red"
        }
      }

      //Esempio di relazione
      const hasObject = {
        name : "hasObject",
        value : {
          "type": "Relationship",
          "object": "urn:ngsi-ld:Building:001"
        }
      }
    */

    return entity;
  }
};
