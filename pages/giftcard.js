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
  const [cardCollectionId, setCardCollectionId] = useState('')

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
      })

      axios.get('/api/collectionCard')
        .then(res => {
          var collectionId = Object.keys(res.data.data[0].cardCollectionId)[0]

          console.log("collectionId:", collectionId)
          if (collectionId) {
            setCardCollectionId(collectionId)
          } else {
            setCardCollectionId('')
          }
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
  }

  function handleSelection(resources) {
    const collectionIdFromResources = resources.selection[0].id;
    setModal({open:false})

    setCardCollectionFn(collectionIdFromResources)
  }

  function setCardCollectionFn(collectionIdFromResources) {
    const url = '/api/collectionCard'

    axios.post(url, collectionIdFromResources)
    .then(res => {
      console.log("collectionIdFromResources:",collectionIdFromResources)
      setCardCollectionId(collectionIdFromResources)
    })
  }

  function handleChangeTextFieldOne (textFieldOne) { setTextFieldOne(textFieldOne)};
  function handleChangeTextFieldTwo (textFieldTwo) { setTextFieldTwo(textFieldTwo)};
  function handleChangeTextFieldThree (textFieldThree) { setTextFieldThree(textFieldThree)};
  function handleChangeTextFieldFour (textFieldFour) { setTextFieldFour(textFieldFour)};
  function handleChangeTextFieldFive (textFieldFive) { setTextFieldFive(textFieldFive)};
  function handleChangeTextFieldSix (textFieldSix) { setTextFieldSix(textFieldSix)};
  function handleChangeTextFieldSeven (textFieldSeven) { setTextFieldSeven(textFieldSeven)};

  async function saveTextFields() {
    const obj = [textFieldOne, textFieldTwo, textFieldThree, textFieldFour, textFieldFive, textFieldSix, textFieldSeven]
    deliveryInstructionsDeleteApi()
    obj.map((textField, i) => {deliveryInstructionsApi({index: i, field: textField})})
  }

  function deliveryInstructionsDeleteApi() {
    const url = '/api/deliveryInstructions'

    axios.delete(url)
  }

  function deliveryInstructionsApi(fieldInput) {
    const url = '/api/deliveryInstructions'

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
    {/* {console.log(cardCollectionId)} */}
        {cardCollectionId ? 
          <EmptyState
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            action={{
              content: 'Select Card Collection',
              onAction: () => setModal({open:true})
            }}
          >
          </EmptyState>
          :
          <GiftComponent cardCollectionId={cardCollectionId}/>
          }

            <Card sectioned title="Delivery Instructions">
              <p style={{"marginBottom":"14px"}}>Fill in your specific delivery instructions options to show in the delivery instructions dropdown on the cart page.</p>
              <TextField
                label="Delivery Instructions 1"
                value={textFieldOne}
                multiline={3}
                onChange={handleChangeTextFieldOne}
                autoComplete="off"
              />
              <div style={{"margin":"10px"}}></div>
              <TextField
                label="Delivery Instructions 2"
                value={textFieldTwo}
                multiline={3}
                onChange={handleChangeTextFieldTwo}
                autoComplete="off"
              />
               <div style={{"margin":"10px"}}></div>
              <TextField
                label="Delivery Instructions 3"
                value={textFieldThree}
                multiline={3}
                onChange={handleChangeTextFieldThree}
                autoComplete="off"
              />
               <div style={{"margin":"10px"}}></div>
              <TextField
                label="Delivery Instructions 4"
                value={textFieldFour}
                multiline={3}
                onChange={handleChangeTextFieldFour}
                autoComplete="off"
              />
               <div style={{"margin":"10px"}}></div>
              <TextField
                label="Delivery Instructions 5"
                value={textFieldFive}
                multiline={3}
                onChange={handleChangeTextFieldFive}
                autoComplete="off"
              />
               <div style={{"margin":"10px"}}></div>
              <TextField
                label="Delivery Instructions 6"
                value={textFieldSix}
                multiline={3}
                onChange={handleChangeTextFieldSix}
                autoComplete="off"
              />
               <div style={{"margin":"10px"}}></div>
              <TextField
                label="Delivery Instructions 7"
                value={textFieldSeven}
                multiline={3}
                onChange={handleChangeTextFieldSeven}
                autoComplete="off"
              />
              <PageActions
                primaryAction={{
                  content: 'Save',
                  onAction: () => saveTextFields()
                }}
              />

            </Card>
</Layout.Section>

            </Layout>
          
        

    </Page>
    </>
  )
}

export default giftCard;