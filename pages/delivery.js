import {useState, useEffect} from 'react'
import axios from 'axios'
import { EmptyState, Layout, Page, Heading, TextField, Card, Button } from '@shopify/polaris';
import { badValueMessage } from 'graphql/validation/rules/ValuesOfCorrectType';

const Delivery = () => {

  const [initialValue, setInitialValueBlack] = useState([]);
  const [initialValueWhite, setInitialValueWhite] = useState([]);

  const [value, setValue] = useState('');
  const [valueWhite, setValueWhite] = useState('');
  const [whitelistedPostcodes, setWhitelistedPostcodes] = useState([])
  const [blacklistedPostcodes, setBlacklistedPostcodes] = useState([])
  const [removeValueBlack, setRemoveValueBlack] = useState('')
  const [removeValueWhite, setRemoveValueWhite] = useState('')

  useEffect(() => {
    // setInitial value for postcodes from db
    getAndSetPostcode()
  }, []);

  const handleChange = (newValue) => {
    setValue(newValue)
  };

  const handleChangeWhite = (newValue) => {
    setValueWhite(newValue)
  };

  const handleChangeRemoveBlack = (newValue) => {
    setRemoveValueBlack(newValue)

  }
  const handleChangeRemoveWhite = (newValue) => {
    setRemoveValueWhite(newValue)
  }

  async function getAndSetPostcode() {
    const url = '/api/postcode'
    axios.get(url)
      .then((res) => { 
        let postcode = res.data.data[1].postcode
        let postcodeWhite = res.data.data[0].postcode
        console.log(res.data.data)
        if (postcode.length) {
          console.log(postcode)
          setBlacklistedPostcodes(postcode)
          setInitialValueBlack(postcode)
        } else {
          setInitialValueBlack([])
        }

        if (postcodeWhite) {
          setWhitelistedPostcodes(postcodeWhite)
          setInitialValueWhite(postcodeWhite)
        }

      })
      .catch(err => console.log(err))
  }

  async function submitPostcodeAPI(status) {
    const url = '/api/postcode'
    let sendingValue;
    
    if (status == 'blacklisted') {
      let trimResults = value.split(',').map(element => {
        return element.trim();
      });

      sendingValue = [...initialValue, ...trimResults];
    }

    if (status == 'whitelisted') {
      let trimResults = valueWhite.split(',').map(element => {
        return element.trim();
      });

      sendingValue = [...initialValueWhite, ...trimResults];
    }

    axios.post(url, {"postcodeRecord": sendingValue, "status": status})
      .then(res => {
        window.location.reload();
      })
      .catch(err => console.log(err))
  }

  async function removePostcodeAPI(status) {
    const url = '/api/postcode'
    let sendingValue;
    
    if (status == 'blacklisted') {
      let trimResults = removeValueBlack.split(',').map(element => {
        return element.trim();
      });

      let copyArr = [...initialValue]
      
      for (var i=0; i<trimResults.length;i++) {
        if (copyArr.indexOf(trimResults[i]) > -1) {
          copyArr.splice(copyArr.indexOf(trimResults[i]), 1);
        }
      }
       
      sendingValue = copyArr;
    }
    
    if (status == 'whitelisted') {
      let trimResults = removeValueWhite.split(',').map(element => {
        return element.trim();
      });

      let copyArr = [...initialValueWhite]
      
      for (var i=0; i<trimResults.length;i++) {
        if (copyArr.indexOf(trimResults[i]) > -1) {
          copyArr.splice(copyArr.indexOf(trimResults[i]), 1);
        }
      }
       
      sendingValue = copyArr;
    }

    axios.post(url, {"postcodeRecord": sendingValue, "status": status})
      .then(res => {
        window.location.reload();
      })
      .catch(err => console.log(err))
  }

  function showBlacklistedModal () {
    console.log('ckucjed')
  }

  return (
    <Page>
          <Card title="Add Blacklisted Postcodes" sectioned>
              <TextField
                label="Separate postcodes by comma"
                value={value}
                onChange={handleChange}
                autoComplete="off"
              />
              <div style={{paddingTop: '10px'}}></div>
              <Button
                large
                primary
                onClick={() => submitPostcodeAPI('blacklisted')}
              >
                Save
              </Button>
              <p><span style={{textDecoration: 'underline'}} onClick={() => showBlacklistedModal()}>Click here</span> to see list of post codes currently blacklisted</p>
          </Card>
          <Card title="Remove Blacklisted Postcodes" sectioned>
              <TextField
                label="Separate postcodes by comma"
                value={removeValueBlack}
                onChange={handleChangeRemoveBlack}
                autoComplete="off"
              />
              <div style={{paddingTop: '10px'}}></div>
              <Button
                large
                primary
                onClick={() => removePostcodeAPI('blacklisted')}
              >
                Remove
              </Button>
          </Card>
          {
            blacklistedPostcodes.length ?
            <Card sectioned title="Blacklisted postcodes">
            <div className="inner-postcodes">
                {
                  blacklistedPostcodes.map((code, i) => {
                    return (
                      <div key={i}>{code}</div>
                    )
                  })
                }
            </div>
          </Card>
            :
            null
          }
         
          <Card title="Add Whitelisted Postcodes" sectioned>
              <TextField
                label="Separate postcodes by comma"
                value={valueWhite}
                onChange={handleChangeWhite}
                autoComplete="off"
              />
              <div style={{paddingTop: '10px'}}></div>
              <Button
                large
                primary
                onClick={() => submitPostcodeAPI('whitelisted')}
              >
                Save
              </Button>
          </Card>
          <Card title="Remove Whitelisted Postcodes" sectioned>
              <TextField
                label="Separate postcodes by comma"
                value={removeValueWhite}
                onChange={handleChangeRemoveWhite}
                autoComplete="off"
              />
              <div style={{paddingTop: '10px'}}></div>
              <Button
                large
                primary
                onClick={() => removePostcodeAPI('whitelisted')}
              >
                Remove
              </Button>
          </Card>
          {
            whitelistedPostcodes.length ?
            <Card sectioned title="Whitelisted postcodes">
            <div className="inner-postcodes">
                {
                  whitelistedPostcodes.map((code, i) => {
                    return (
                      <div key={i}>{code}</div>
                    )
                  })
                }
            </div>
          </Card>
            :
            null
          }

    </Page>
  )
}

export default Delivery;