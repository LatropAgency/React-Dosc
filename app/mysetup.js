let error = true

let res = [
  db.companies.drop(),
  db.companies.insert({ _id: '958cfb44-7df1-11eb-9982-0242ac120003', name: 'Apple' }),
  db.companies.insert({ _id: '959b7458-7df1-11eb-9982-0242ac120003', name: 'Tesla' }),
  db.companies.insert({ _id: '95a5bc60-7df1-11eb-9982-0242ac120003', name: 'Google' }),
  db.companies.insert({ _id: '95a5de7a-7df1-11eb-9982-0242ac120003', name: 'ZeslaGroup' }),
]

printjson(res)

if (error) {
  print('Error, exiting')
  quit(1)
}
