import {useState, useEffect} from 'react'
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import axios from 'axios'
import {Card, Stack, Page, EmptyState, TextField, ResourceList, TextStyle, PageActions, Layout, DisplayText} from '@shopify/polaris'
import GiftComponent from '../components/GiftComponent';

const giftCard = () => {
  useEffect(() => {
    initFunction();
  }, [])

  const [modal, setModal] = useState({ open: false })
  const [textFieldOne, setTextFieldOne] = useState('')
  const [textFieldTwo, setTextFieldTwo] = useState('')
  const [textFieldThree, setTextFieldThree] = useState('')
  const [textFieldFour, setTextFieldFour] = useState('')
  const [textFieldFive, setTextFieldFive] = useState('')
  const [textFieldSix, setTextFieldSix] = useState('')
  const [textFieldSeven, setTextFieldSeven] = useState('')
  const [textFieldEight, setTextFieldEight] = useState('')
  const [textFieldNine, setTextFieldNine] = useState('')
  const [occasionFieldOne, setOccasionFieldOne] = useState('')
  const [occasionFieldTwo, setOccasionFieldTwo] = useState('')
  const [occasionFieldThree, setOccasionFieldThree] = useState('')
  const [occasionFieldFour, setOccasionFieldFour] = useState('')
  const [occasionFieldFive, setOccasionFieldFive] = useState('')
  const [occasionFieldSix, setOccasionFieldSix] = useState('')
  const [occasionFieldSeven, setOccasionFieldSeven] = useState('')
  const [occasionFieldEight, setOccasionFieldEight] = useState('')
  const [occasionFieldNine, setOccasionFieldNine] = useState('')
  const [cardCollectionId, setCardCollectionId] = useState('')
  const [collectionTitle, setCollectionTitle] = useState('')

  function initFunction() {
    axios.get('/api/deliveryInstructions')
    .then(res => {
      res.data.data.forEach(option => {
        if (option.deliveryOptionsId.index === 0) {
          setTextFieldOne(option.deliveryOptionsId.field)
        }
        if (option.deliveryOptionsId.index === 1) {
          setTextFieldTwo(option.deliveryOptionsId.field)
        }
        if (option.deliveryOptionsId.index === 2) {
          setTextFieldThree(option.deliveryOptionsId.field)
        }
        if (option.deliveryOptionsId.index === 3) {
          setTextFieldFour(option.deliveryOptionsId.field)
        }
        if (option.deliveryOptionsId.index === 4) {
          setTextFieldFive(option.deliveryOptionsId.field)
        }
        if (option.deliveryOptionsId.index === 5) {
          setTextFieldSix(option.deliveryOptionsId.field)
        }
        if (option.deliveryOptionsId.index === 6) {
          setTextFieldSeven(option.deliveryOptionsId.field)
        }
        if (option.deliveryOptionsId.index === 7) {
          setTextFieldEight(option.deliveryOptionsId.field)
        }
        if (option.deliveryOptionsId.index === 8) {
          setTextFieldNine(option.deliveryOptionsId.field)
        }
      })

      axios.get('/api/collectionCard')
        .then(res => {
       
          if (res.data.data.length) {
            var collectionId = res.data.data[0].cardCollectionId

            if (collectionId) {
              setCardCollectionId(collectionId)
            } else {
              setCardCollectionId('')
            }
          }

          // put in third call for occassions dropdown
          axios.get('/api/occasion')
            .then(res => {

              res.data.data.forEach(option => {
                if (option.occasionsOptionsId.index === 0) {
                  setOccasionFieldOne(option.occasionsOptionsId.field)
                }
                if (option.occasionsOptionsId.index === 1) {
                  setOccasionFieldTwo(option.occasionsOptionsId.field)
                }
                if (option.occasionsOptionsId.index === 2) {
                  setOccasionFieldThree(option.occasionsOptionsId.field)
                }
                if (option.occasionsOptionsId.index === 3) {
                  setOccasionFieldFour(option.occasionsOptionsId.field)
                }
                if (option.occasionsOptionsId.index === 4) {
                  setOccasionFieldFive(option.occasionsOptionsId.field)
                }
                if (option.occasionsOptionsId.index === 5) {
                  setOccasionFieldSix(option.occasionsOptionsId.field)
                }
                if (option.occasionsOptionsId.index === 6) {
                  setOccasionFieldSeven(option.occasionsOptionsId.field)
                }
                if (option.occasionsOptionsId.index === 7) {
                  setOccasionFieldEight(option.occasionsOptionsId.field)
                }
                if (option.occasionsOptionsId.index === 8) {
                  setOccasionFieldNine(option.occasionsOptionsId.field)
                }
              })
            })
        })
    })
    .catch(err => console.log(err))
  }

  function handleSelection(resources) {
    const collectionIdFromResources = resources.selection[0].id;
    const title = resources.selection[0].title
    setModal({open:false})

    setCardCollectionFn(collectionIdFromResources, title)
  }

  function setCardCollectionFn(collectionIdFromResources, title) {
    const url = '/api/collectionCard'

    axios.post(url, {"collection": collectionIdFromResources, "title": title})
    .then(res => {
      console.log("collectionIdFromResources:",collectionIdFromResources)
      setCardCollectionId(collectionIdFromResources)
      setCollectionTitle(title)
    })
  }

  function handleChangeTextFieldOne (textFieldOne) { setTextFieldOne(textFieldOne)};
  function handleChangeTextFieldTwo (textFieldTwo) { setTextFieldTwo(textFieldTwo)};
  function handleChangeTextFieldThree (textFieldThree) { setTextFieldThree(textFieldThree)};
  function handleChangeTextFieldFour (textFieldFour) { setTextFieldFour(textFieldFour)};
  function handleChangeTextFieldFive (textFieldFive) { setTextFieldFive(textFieldFive)};
  function handleChangeTextFieldSix (textFieldSix) { setTextFieldSix(textFieldSix)};
  function handleChangeTextFieldSeven (textFieldSeven) { setTextFieldSeven(textFieldSeven)};
  function handleChangeTextFieldEight (textFieldEight) { setTextFieldEight(textFieldEight)};
  function handleChangeTextFieldNine (textFieldNine) { setTextFieldNine(textFieldNine)};

  function handleChangeOccasionFieldOne (textFieldOne) { setOccasionFieldOne(textFieldOne)};
  function handleChangeOccasionFieldTwo (textFieldTwo) { setOccasionFieldTwo(textFieldTwo)};
  function handleChangeOccasionFieldThree (textFieldThree) { setOccasionFieldThree(textFieldThree)};
  function handleChangeOccasionFieldFour (textFieldFour) { setOccasionFieldFour(textFieldFour)};
  function handleChangeOccasionFieldFive (textFieldFive) { setOccasionFieldFive(textFieldFive)};
  function handleChangeOccasionFieldSix (textFieldSix) { setOccasionFieldSix(textFieldSix)};
  function handleChangeOccasionFieldSeven (textFieldSeven) { setOccasionFieldSeven(textFieldSeven)};
  function handleChangeOccasionFieldEight (textFieldEight) { setOccasionFieldEight(textFieldEight)};
  function handleChangeOccasionFieldNine (textFieldNine) { setOccasionFieldNine(textFieldNine)};

  async function saveTextFields() {
    const obj = [textFieldOne, textFieldTwo, textFieldThree, textFieldFour, textFieldFive, textFieldSix, textFieldSeven, textFieldEight, textFieldNine]
    deliveryInstructionsDeleteApi()
    obj.map((textField, i) => {deliveryInstructionsApi({index: i, field: textField})})
  }

  async function saveOccasionFields() {
    const obj = [occasionFieldOne, occasionFieldTwo, occasionFieldThree, occasionFieldFour, occasionFieldFive, occasionFieldSix, occasionFieldSeven, occasionFieldEight, occasionFieldNine]
    occasionsDeleteApi()
    obj.map((textField, i) => {occasionsApi({index: i, field: textField})})
    obj.map((textField, i) => {console.log({index: i, field: textField})})
  }

  function deliveryInstructionsDeleteApi() {
    const url = '/api/deliveryInstructions'

    axios.delete(url)
  }

  function occasionsDeleteApi() {
    const url = '/api/occasion'

    axios.delete(url)
  }

  function deliveryInstructionsApi(fieldInput) {
    const url = '/api/deliveryInstructions'

    axios.post(url, fieldInput)
      .then(res => window.location.reload())
      .catch(err => console.log(err))
  }

  function occasionsApi(fieldInput) {
    const url = '/api/occasion'

    axios.post(url, fieldInput)
      .then(res => window.location.reload())
      .catch(err => console.log(err))
  }

  return (
    <>
    <Page>
     
    <Layout>
      <Layout.Section>
      <ResourcePicker
          resourceType="Collection"
          selectMultiple={false}
          open={modal.open}
          onCancel={() =>  setModal({open: false}) }
          onSelection={(resources) => handleSelection(resources)}
        />

      </Layout.Section>

<Layout.Section>
        {cardCollectionId ? 
          <GiftComponent cardCollectionId={cardCollectionId} collectionTitle={collectionTitle}/>
          :
          <Card sectioned>
            <EmptyState
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              action={{
                content: 'Select Card Collection',
                onAction: () => setModal({open:true})
              }}
            >
            </EmptyState>
          </Card>
          }

            <Card sectioned title="Delivery Instructions">
              <p style={{"marginBottom":"14px"}}>Fill in your specific delivery instructions options to show in the delivery instructions dropdown on the cart page.</p>
              <TextField
                label="Delivery Instructions 1"
                value={textFieldOne}
                multiline={1}
                onChange={handleChangeTextFieldOne}
                autoComplete="off"
              />
              <div style={{"margin":"10px"}}></div>
              <TextField
                label="Delivery Instructions 2"
                value={textFieldTwo}
                multiline={1}
                onChange={handleChangeTextFieldTwo}
                autoComplete="off"
              />
               <div style={{"margin":"10px"}}></div>
              <TextField
                label="Delivery Instructions 3"
                value={textFieldThree}
                multiline={1}
                onChange={handleChangeTextFieldThree}
                autoComplete="off"
              />
               <div style={{"margin":"10px"}}></div>
              <TextField
                label="Delivery Instructions 4"
                value={textFieldFour}
                multiline={1}
                onChange={handleChangeTextFieldFour}
                autoComplete="off"
              />
               <div style={{"margin":"10px"}}></div>
              <TextField
                label="Delivery Instructions 5"
                value={textFieldFive}
                multiline={1}
                onChange={handleChangeTextFieldFive}
                autoComplete="off"
              />
               <div style={{"margin":"10px"}}></div>
              <TextField
                label="Delivery Instructions 6"
                value={textFieldSix}
                multiline={1}
                onChange={handleChangeTextFieldSix}
                autoComplete="off"
              />
               <div style={{"margin":"10px"}}></div>
              <TextField
                label="Delivery Instructions 7"
                value={textFieldSeven}
                multiline={1}
                onChange={handleChangeTextFieldSeven}
                autoComplete="off"
              />
               <div style={{"margin":"10px"}}></div>
              <TextField
                label="Delivery Instructions 8"
                value={textFieldEight}
                multiline={1}
                onChange={handleChangeTextFieldEight}
                autoComplete="off"
              />
               <div style={{"margin":"10px"}}></div>
              <TextField
                label="Delivery Instructions 9"
                value={textFieldNine}
                multiline={1}
                onChange={handleChangeTextFieldNine}
                autoComplete="off"
              />
              <PageActions
                primaryAction={{
                  content: 'Save',
                  onAction: () => saveTextFields()
                }}
              />

            </Card>


            {/* <Card sectioned title="Ocassions">
              <p style={{"marginBottom":"14px"}}>Fill in your ocassion options to show on the cart page.</p>
              <TextField
                label="Occasion 1"
                value={occasionFieldOne}
                multiline={1}
                onChange={handleChangeOccasionFieldOne}
                autoComplete="off"
              />
              <div style={{"margin":"10px"}}></div>
              <TextField
                label="Occasion 2"
                value={occasionFieldTwo}
                multiline={1}
                onChange={handleChangeOccasionFieldTwo}
                autoComplete="off"
              />
               <div style={{"margin":"10px"}}></div>
              <TextField
                label="Occasion 3"
                value={occasionFieldThree}
                multiline={1}
                onChange={handleChangeOccasionFieldThree}
                autoComplete="off"
              />
               <div style={{"margin":"10px"}}></div>
              <TextField
                label="Occasion 4"
                value={occasionFieldFour}
                multiline={1}
                onChange={handleChangeOccasionFieldFour}
                autoComplete="off"
              />
               <div style={{"margin":"10px"}}></div>
              <TextField
                label="Occasion 5"
                value={occasionFieldFive}
                multiline={1}
                onChange={handleChangeOccasionFieldFive}
                autoComplete="off"
              />
               <div style={{"margin":"10px"}}></div>
              <TextField
                label="Occasion 6"
                value={occasionFieldSix}
                multiline={1}
                onChange={handleChangeOccasionFieldSix}
                autoComplete="off"
              />
               <div style={{"margin":"10px"}}></div>
              <TextField
                label="Occasion 7"
                value={occasionFieldSeven}
                multiline={1}
                onChange={handleChangeOccasionFieldSeven}
                autoComplete="off"
              />
               <div style={{"margin":"10px"}}></div>
              <TextField
                label="Occasion 8"
                value={occasionFieldEight}
                multiline={1}
                onChange={handleChangeOccasionFieldEight}
                autoComplete="off"
              />
               <div style={{"margin":"10px"}}></div>
              <TextField
                label="Occasion 9"
                value={occasionFieldNine}
                multiline={1}
                onChange={handleChangeOccasionFieldNine}
                autoComplete="off"
              />
              <PageActions
                primaryAction={{
                  content: 'Save',
                  onAction: () => saveOccasionFields()
                }}
              />

            </Card> */}
</Layout.Section>

            </Layout>
          
        

    </Page>
    </>
  )
}

export default giftCard;