class InvesterConsultant {
    constructor(createdAt,requestoruser_id,requestorname,requestoremail,requestorphone,requestoravatar_url,
        provideruser_id,providername,provideremail,providerphone,provideravatar_url,providercompany,state,country) {
            this.createdAt = createdAt,
            this.requestoruser_id = requestoruser_id;
            this.requestorname = requestorname;
            this.requestoremail = requestoremail;
            this.requestorphone = requestorphone;
            this.requestoravatar_url = requestoravatar_url,
            this.provideruser_id = provideruser_id,
            this.providername = providername,
            this.provideremail = provideremail,
            this.providerphone = providerphone,
            this.provideravatar_url = provideravatar_url,
            this.providercompany = providercompany,
            this.state=state,
            this.country = country
    }
  }

  module.exports = InvesterConsultant;