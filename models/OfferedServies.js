class OfferedServies {
    constructor(id,company,email,phone,avatar_url,image,subCatagory,name,price,categry,country,state) {
      this.userid = id;
      this.company = company;
      this.email = email;
      this.phone = phone;
      this.profilePic = avatar_url,
      this.serviceimage = image,
      this.subCatagory = subCatagory,
      this.name = name,
      this.price = price,
      this.category = categry,
      this.country = country,
      this.state = state
    }
  }

  module.exports = OfferedServies;