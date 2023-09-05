class Propertyitem {
    constructor(productId,title,country,city,price,images,rating,owner,seenBy,user_description,createdAt,propertyStatus,bath,bed,size) {
      this.id=productId
      this.title = title,
      this.country = country,
      this.city = city,
      this.price = price,
      this.images = images,
      this.rating = rating,
      this.seenBy = seenBy,
      this.owner = owner,
      this.user_description = user_description,
      this.createdAt = createdAt,
      this.propertyStatus = propertyStatus,
      this.bath=bath,
      this.bed=bed,
      this.size=size
    }
  }

module.exports = Propertyitem;