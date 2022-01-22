import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { EmptyState, Layout, Page, Heading, Card } from '@shopify/polaris';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';

// import TestComponent from '../components/TestComponent'


const Index = () => {

  const [modal, setModal] = useState({ open: false })
  const [modalProd, setModalProd] = useState({ open: false })
  const [collectionId, setCollectionId] = useState('')

  useEffect(() => {
    getUpsellCollection() 
  }, [])

  
  function handleSelection(resources) {
    const collectionIdFromResources = resources.selection[0].id;
    setModal({open:false})
    // store.set('ids', collectionIdFromResources)
    
    // change this to removing the products
    setUpsellCollection(collectionIdFromResources)
  }

  function setUpsellCollection(collectionIdFromResources) {
    const url = '/api/collectionUpsell'
    console.log(collectionIdFromResources)

    axios.post(url, {"collection": collectionIdFromResources})
      .then(res => {
        setCollectionId(collectionIdFromResources)
      })
  }

  function getUpsellCollection() {
    const url = '/api/collectionUpsell'

    axios.get(url)
      .then(res => {
        console.log(res)
        if (res.data.data.length) {
          setCollectionId(res.data.data[0].upsellCollectionId)
        } else {
          setCollectionId('')
        }
        
    })
  }

  // function removeUpsellCollectionApi() {
  //   const url = '/api/collectionUpsell'
  //   store.set('ids', '')
  //   axios.delete(url)
  //     .then(res => {
  //       console.log('reloading')
  //       window.location.reload();
  //     })
  // }

  return (
      <Page>
        
        
        <Card sectioned>
            <ResourcePicker
            resourceType="Collection"
            selectMultiple={false}
            open={modal.open}
            onCancel={() =>  setModal({open: false}) }
            onSelection={(resources) => handleSelection(resources)}
          />

          <EmptyState
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          heading="Manage your Upsells"
          action={{
            content: 'Select Collection',
            onAction: () => setModal({open:true})
          }}
          >
          </EmptyState>
        </Card>
        
        
      </Page>
  )
};

export default Index;
