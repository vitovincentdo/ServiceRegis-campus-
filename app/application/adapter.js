import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: "http://127.0.0.1:5000",

  createRecord(store, type, snapshot){
    let data = {};
    let serializer = store.serializerFor(type.modelName);
    const url = `${this.host}/api/data/post`;
    
    serializer.serializeIntoHash(data, type, snapshot);

    // snapshot.rollbackAttributes();

    return this.ajax(url, "POST", { data: data})
  },
  findAll(store, type, sinceToken, snapshotRecordArray){
      let query = this.buildQuery(snapshotRecordArray);
      let url = `${this.host}/api/data/list`;
  
      if (sinceToken) {
        query.since = sinceToken;
      }
  
      return this.ajax(url, 'GET', { data: query });
  },
});
