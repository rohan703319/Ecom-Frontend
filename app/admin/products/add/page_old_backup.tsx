"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, Save, Upload, X, Info, Search, Image, Package,
  Tag, BarChart3, Globe, Settings, Truck, Gift, Calendar,
  Users, DollarSign, Shield, FileText, Link as LinkIcon, ShoppingCart
} from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermCross, setSearchTermCross] = useState('');
  const [attributes, setAttributes] = useState<Array<{id: string, name: string, values: string[]}>>([]);

  // Sample products for selection
  const availableProducts = [
    { id: '1', name: 'Wireless Headphones', sku: 'WH-001', price: '$299' },
    { id: '2', name: 'Smart Watch Pro', sku: 'SW-002', price: '$399' },
    { id: '3', name: 'Laptop Stand', sku: 'LS-003', price: '$49' },
    { id: '4', name: 'USB-C Hub', sku: 'UCH-004', price: '$79' },
    { id: '5', name: 'Mechanical Keyboard', sku: 'MK-005', price: '$149' },
    { id: '6', name: 'Wireless Mouse', sku: 'WM-006', price: '$59' },
    { id: '7', name: 'Monitor 27"', sku: 'MON-007', price: '$349' },
    { id: '8', name: 'Webcam HD', sku: 'WC-008', price: '$89' },
  ];

  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    shortDescription: '',
    fullDescription: '',
    sku: '',
    categories: '',
    manufacturer: '',
    published: true,
    productType: 'simple',
    visibleIndividually: true,
    customerRoles: 'all',
    limitedToStores: false,
    vendorId: '',
    requireOtherProducts: false,
    requiredProductIds: '',
    automaticallyAddProducts: false,
    showOnHomepage: false,
    displayOrder: '1',
    productTags: '',
    gtin: '',
    manufacturerPartNumber: '',
    adminComment: '',

    // Related Products
    relatedProducts: [] as string[],
    crossSellProducts: [] as string[],

    // Pricing
    price: '',
    oldPrice: '',
    cost: '',
    disableBuyButton: false,
    disableWishlistButton: false,
    availableForPreOrder: false,
    preOrderAvailabilityStartDate: '',
    callForPrice: false,
    customerEntersPrice: false,
    minimumCustomerEnteredPrice: '',
    maximumCustomerEnteredPrice: '',
    basepriceEnabled: false,
    basepriceAmount: '',
    basepriceUnit: '',
    basepriceBaseAmount: '',
    basepriceBaseUnit: '',
    markAsNew: false,
    markAsNewStartDate: '',
    markAsNewEndDate: '',

    // Discounts
    hasDiscountsApplied: false,
    availableStartDate: '',
    availableEndDate: '',

    // Tax
    taxExempt: false,
    taxCategoryId: '',
    telecommunicationsBroadcastingElectronicServices: false,

    // SEO
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
    searchEngineFriendlyPageName: '',

    // Inventory
    manageInventory: 'track',
    stockQuantity: '',
    displayStockAvailability: true,
    displayStockQuantity: false,
    minStockQuantity: '',
    lowStockActivity: 'nothing',
    notifyAdminForQuantityBelow: '',
    backorders: 'no-backorders',
    allowBackInStockSubscriptions: false,
    productAvailabilityRange: '',
    minCartQuantity: '1',
    maxCartQuantity: '10000',
    allowedQuantities: '',
    allowAddingOnlyExistingAttributeCombinations: false,
    notReturnable: false,

    // Shipping
    isShipEnabled: true,
    isFreeShipping: false,
    shipSeparately: false,
    additionalShippingCharge: '',
    deliveryDateId: '',
    weight: '',
    length: '',
    width: '',
    height: '',

    // Gift Cards
    isGiftCard: false,
    giftCardType: 'virtual',
    overriddenGiftCardAmount: '',

    // Downloadable Product
    isDownload: false,
    downloadId: '',
    unlimitedDownloads: true,
    maxNumberOfDownloads: '',
    downloadExpirationDays: '',
    downloadActivationType: 'when-order-is-paid',
    hasUserAgreement: false,
    userAgreementText: '',
    hasSampleDownload: false,
    sampleDownloadId: '',

    // Recurring Product
    isRecurring: false,
    recurringCycleLength: '',
    recurringCyclePeriod: 'days',
    recurringTotalCycles: '',

    // Rental Product
    isRental: false,
    rentalPriceLength: '',
    rentalPricePeriod: 'days',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Prepare product data for API
      const productData = {
        name: formData.name,
        description: formData.fullDescription || formData.shortDescription,
        shortDescription: formData.shortDescription,
        price: parseFloat(formData.price) || 0,
        sku: formData.sku,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        categoryId: formData.categories || null,
        images: [],
        isPublished: formData.published,
        isFeatured: formData.showOnHomepage,
        // Additional fields
        oldPrice: parseFloat(formData.oldPrice) || null,
        cost: parseFloat(formData.cost) || null,
        weight: parseFloat(formData.weight) || null,
        length: parseFloat(formData.length) || null,
        width: parseFloat(formData.width) || null,
        height: parseFloat(formData.height) || null,
        manufacturer: formData.manufacturer,
        tags: formData.productTags,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords,
        // Related products
        relatedProductIds: formData.relatedProducts,
        crossSellProductIds: formData.crossSellProducts,
        // Attributes
        attributes: attributes.map(attr => ({
          name: attr.name,
          values: attr.values.filter(v => v)
        }))
      };

      console.log('Submitting product data:', productData);

      // Call API
      const response = await fetch('http://localhost:5285/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Product created successfully:', result);
        alert('Product created successfully!');
        router.push('/admin/products');
      } else {
        const error = await response.json();
        console.error('Error creating product:', error);
        alert('Error creating product: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please check console for details.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const addRelatedProduct = (productId: string) => {
    if (!formData.relatedProducts.includes(productId)) {
      setFormData({
        ...formData,
        relatedProducts: [...formData.relatedProducts, productId]
      });
    }
    setSearchTerm('');
  };

  const removeRelatedProduct = (productId: string) => {
    setFormData({
      ...formData,
      relatedProducts: formData.relatedProducts.filter(id => id !== productId)
    });
  };

  const addCrossSellProduct = (productId: string) => {
    if (!formData.crossSellProducts.includes(productId)) {
      setFormData({
        ...formData,
        crossSellProducts: [...formData.crossSellProducts, productId]
      });
    }
    setSearchTermCross('');
  };

  const removeCrossSellProduct = (productId: string) => {
    setFormData({
      ...formData,
      crossSellProducts: formData.crossSellProducts.filter(id => id !== productId)
    });
  };

  const filteredProducts = availableProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProductsCross = availableProducts.filter(p =>
    p.name.toLowerCase().includes(searchTermCross.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTermCross.toLowerCase())
  );

  const addAttribute = () => {
    const newAttribute = {
      id: Date.now().toString(),
      name: '',
      values: ['']
    };
    setAttributes([...attributes, newAttribute]);
  };

  const removeAttribute = (id: string) => {
    setAttributes(attributes.filter(attr => attr.id !== id));
  };

  const updateAttributeName = (id: string, name: string) => {
    setAttributes(attributes.map(attr =>
      attr.id === id ? { ...attr, name } : attr
    ));
  };

  const updateAttributeValue = (attrId: string, valueIndex: number, value: string) => {
    setAttributes(attributes.map(attr => {
      if (attr.id === attrId) {
        const newValues = [...attr.values];
        newValues[valueIndex] = value;
        return { ...attr, values: newValues };
      }
      return attr;
    }));
  };

  const addAttributeValue = (attrId: string) => {
    setAttributes(attributes.map(attr => {
      if (attr.id === attrId) {
        return { ...attr, values: [...attr.values, ''] };
      }
      return attr;
    }));
  };

  const removeAttributeValue = (attrId: string, valueIndex: number) => {
    setAttributes(attributes.map(attr => {
      if (attr.id === attrId) {
        return { ...attr, values: attr.values.filter((_, idx) => idx !== valueIndex) };
      }
      return attr;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-slate-950/80 backdrop-blur-xl z-10 py-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Add a New Product
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">Create and configure your product</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 text-sm font-medium">
            Draft
          </span>
          <button
            onClick={() => router.push('/admin/products')}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 transition-all text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-violet-500/50 transition-all text-sm flex items-center gap-2 font-semibold"
          >
            <Save className="h-4 w-4" />
            Save & Continue
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Main Form */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <Tabs defaultValue="product-info" className="w-full">
              <div className="border-b border-slate-800 mb-6">
                <div className="flex gap-1 overflow-x-auto pb-px">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-violet-400 border-b-2 border-violet-500 whitespace-nowrap"
                  >
                    <Info className="h-4 w-4" />
                    Product Info
                  </button>
                  <TabsTrigger value="prices">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Prices
                  </TabsTrigger>
                  <TabsTrigger value="inventory">
                    <Package className="h-4 w-4 mr-2" />
                    Inventory
                  </TabsTrigger>
                  <TabsTrigger value="shipping">
                    <Truck className="h-4 w-4 mr-2" />
                    Shipping
                  </TabsTrigger>
                  <TabsTrigger value="related-products">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Related
                  </TabsTrigger>
                  <TabsTrigger value="attributes">
                    <Tag className="h-4 w-4 mr-2" />
                    Attributes
                  </TabsTrigger>
                </TabsList>

                {/* Product Info Tab */}
                <TabsContent value="product-info" className="space-y-6 mt-6">
                  {/* Basic Info Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Basic Info</h3>

                    <div className="grid gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter product name"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Short Description
                        </label>
                        <textarea
                          name="shortDescription"
                          value={formData.shortDescription}
                          onChange={handleChange}
                          placeholder="Brief product description (shown in product lists)"
                          rows={3}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Full Description
                        </label>
                        <textarea
                          name="fullDescription"
                          value={formData.fullDescription}
                          onChange={handleChange}
                          placeholder="Detailed product description with features and specifications"
                          rows={8}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-muted-foreground mt-1">HTML markup is supported</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            SKU <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            placeholder="e.g., PROD-001"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Categories</label>
                          <select
                            name="categories"
                            value={formData.categories}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select category</option>
                            <option value="electronics">Electronics</option>
                            <option value="fashion">Fashion & Apparel</option>
                            <option value="sports">Sports & Outdoors</option>
                            <option value="home">Home & Living</option>
                            <option value="books">Books & Media</option>
                            <option value="toys">Toys & Games</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Manufacturer</label>
                          <input
                            type="text"
                            name="manufacturer"
                            value={formData.manufacturer}
                            onChange={handleChange}
                            placeholder="Manufacturer/Brand name"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Product Type</label>
                          <select
                            name="productType"
                            value={formData.productType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="simple">Simple Product</option>
                            <option value="grouped">Grouped Product (product variants)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">GTIN</label>
                          <input
                            type="text"
                            name="gtin"
                            value={formData.gtin}
                            onChange={handleChange}
                            placeholder="Global Trade Item Number"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Manufacturer Part Number</label>
                          <input
                            type="text"
                            name="manufacturerPartNumber"
                            value={formData.manufacturerPartNumber}
                            onChange={handleChange}
                            placeholder="MPN"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Display Order</label>
                          <input
                            type="number"
                            name="displayOrder"
                            value={formData.displayOrder}
                            onChange={handleChange}
                            placeholder="1"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Product Tags</label>
                        <input
                          type="text"
                          name="productTags"
                          value={formData.productTags}
                          onChange={handleChange}
                          placeholder="tag1, tag2, tag3"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Comma-separated tags</p>
                      </div>
                    </div>
                  </div>

                  {/* Publishing Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Publishing</h3>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="published"
                          checked={formData.published}
                          onChange={handleChange}
                          className="rounded"
                        />
                        <span className="text-sm">Published</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="visibleIndividually"
                          checked={formData.visibleIndividually}
                          onChange={handleChange}
                          className="rounded"
                        />
                        <span className="text-sm">Visible individually</span>
                        <span className="text-xs text-muted-foreground">(can be accessed from catalog)</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="showOnHomepage"
                          checked={formData.showOnHomepage}
                          onChange={handleChange}
                          className="rounded"
                        />
                        <span className="text-sm">Show on home page</span>
                      </label>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Available Start Date/Time</label>
                        <input
                          type="datetime-local"
                          name="availableStartDate"
                          value={formData.availableStartDate}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Available End Date/Time</label>
                        <input
                          type="datetime-local"
                          name="availableEndDate"
                          value={formData.availableEndDate}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Admin Comment */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Admin Comment</h3>
                    <div>
                      <textarea
                        name="adminComment"
                        value={formData.adminComment}
                        onChange={handleChange}
                        placeholder="Internal notes (not visible to customers)"
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Prices Tab */}
                <TabsContent value="prices" className="space-y-6 mt-6">
                  {/* Price Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Price</h3>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Price ($) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Old Price ($)</label>
                        <input
                          type="number"
                          name="oldPrice"
                          value={formData.oldPrice}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Shows as strikethrough</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Product Cost ($)</label>
                        <input
                          type="number"
                          name="cost"
                          value={formData.cost}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-muted-foreground mt-1">For profit calculation</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="disableBuyButton"
                          checked={formData.disableBuyButton}
                          onChange={handleChange}
                          className="rounded"
                        />
                        <span className="text-sm">Disable buy button</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="disableWishlistButton"
                          checked={formData.disableWishlistButton}
                          onChange={handleChange}
                          className="rounded"
                        />
                        <span className="text-sm">Disable wishlist button</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="callForPrice"
                          checked={formData.callForPrice}
                          onChange={handleChange}
                          className="rounded"
                        />
                        <span className="text-sm">Call for price</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="customerEntersPrice"
                          checked={formData.customerEntersPrice}
                          onChange={handleChange}
                          className="rounded"
                        />
                        <span className="text-sm">Customer enters price</span>
                      </label>
                    </div>

                    {formData.customerEntersPrice && (
                      <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium mb-2">Minimum Amount</label>
                          <input
                            type="number"
                            name="minimumCustomerEnteredPrice"
                            value={formData.minimumCustomerEnteredPrice}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Maximum Amount</label>
                          <input
                            type="number"
                            name="maximumCustomerEnteredPrice"
                            value={formData.maximumCustomerEnteredPrice}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pre-order Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Pre-order</h3>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="availableForPreOrder"
                        checked={formData.availableForPreOrder}
                        onChange={handleChange}
                        className="rounded"
                      />
                      <span className="text-sm">Available for pre-order</span>
                    </label>

                    {formData.availableForPreOrder && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Pre-order Availability Start Date</label>
                        <input
                          type="datetime-local"
                          name="preOrderAvailabilityStartDate"
                          value={formData.preOrderAvailabilityStartDate}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>

                  {/* Mark as New Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Mark as New</h3>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="markAsNew"
                        checked={formData.markAsNew}
                        onChange={handleChange}
                        className="rounded"
                      />
                      <span className="text-sm">Mark as new product</span>
                    </label>

                    {formData.markAsNew && (
                      <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium mb-2">Start Date</label>
                          <input
                            type="datetime-local"
                            name="markAsNewStartDate"
                            value={formData.markAsNewStartDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">End Date</label>
                          <input
                            type="datetime-local"
                            name="markAsNewEndDate"
                            value={formData.markAsNewEndDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tax Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Tax</h3>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="taxExempt"
                        checked={formData.taxExempt}
                        onChange={handleChange}
                        className="rounded"
                      />
                      <span className="text-sm">Tax exempt</span>
                    </label>

                    <div>
                      <label className="block text-sm font-medium mb-2">Tax Category</label>
                      <select
                        name="taxCategoryId"
                        value={formData.taxCategoryId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">None</option>
                        <option value="1">Standard</option>
                        <option value="2">Books</option>
                        <option value="3">Electronics</option>
                        <option value="4">Food & Beverages</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>

                {/* Inventory Tab */}
                <TabsContent value="inventory" className="space-y-6 mt-6">
                  {/* Inventory Method Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Inventory Method</h3>

                    <div>
                      <label className="block text-sm font-medium mb-2">Inventory Method</label>
                      <select
                        name="manageInventory"
                        value={formData.manageInventory}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="dont-track">Don't track inventory</option>
                        <option value="track">Track inventory</option>
                        <option value="track-by-attributes">Track inventory by product attributes</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Choose how you want to manage inventory for this product
                      </p>
                    </div>
                  </div>

                  {/* Inventory Settings */}
                  {formData.manageInventory === 'track' && (
                    <>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Stock Quantity</h3>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Stock Quantity <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="stockQuantity"
                              value={formData.stockQuantity}
                              onChange={handleChange}
                              placeholder="0"
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Minimum Stock Quantity</label>
                            <input
                              type="number"
                              name="minStockQuantity"
                              value={formData.minStockQuantity}
                              onChange={handleChange}
                              placeholder="0"
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Low Stock Activity</label>
                            <select
                              name="lowStockActivity"
                              value={formData.lowStockActivity}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="nothing">Nothing</option>
                              <option value="disable-buy">Disable buy button</option>
                              <option value="unpublish">Unpublish product</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Notify Admin for Quantity Below</label>
                            <input
                              type="number"
                              name="notifyAdminForQuantityBelow"
                              value={formData.notifyAdminForQuantityBelow}
                              onChange={handleChange}
                              placeholder="1"
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Backorders</label>
                          <select
                            name="backorders"
                            value={formData.backorders}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="no-backorders">No backorders</option>
                            <option value="allow-qty-below-zero">Allow qty below 0</option>
                            <option value="allow-qty-below-zero-and-notify">Allow qty below 0 and notify customer</option>
                          </select>
                        </div>

                        <div className="space-y-3">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="displayStockAvailability"
                              checked={formData.displayStockAvailability}
                              onChange={handleChange}
                              className="rounded"
                            />
                            <span className="text-sm">Display stock availability</span>
                          </label>

                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="displayStockQuantity"
                              checked={formData.displayStockQuantity}
                              onChange={handleChange}
                              className="rounded"
                            />
                            <span className="text-sm">Display stock quantity</span>
                          </label>

                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="allowBackInStockSubscriptions"
                              checked={formData.allowBackInStockSubscriptions}
                              onChange={handleChange}
                              className="rounded"
                            />
                            <span className="text-sm">Allow back in stock subscriptions</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Multiple Warehouses</h3>

                        <div>
                          <label className="block text-sm font-medium mb-2">Product Availability Range</label>
                          <select
                            name="productAvailabilityRange"
                            value={formData.productAvailabilityRange}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">None</option>
                            <option value="1-2-days">1-2 days</option>
                            <option value="3-5-days">3-5 days</option>
                            <option value="1-week">1 week</option>
                            <option value="2-weeks">2 weeks</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Cart Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Cart Settings</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Minimum Cart Quantity</label>
                        <input
                          type="number"
                          name="minCartQuantity"
                          value={formData.minCartQuantity}
                          onChange={handleChange}
                          placeholder="1"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Maximum Cart Quantity</label>
                        <input
                          type="number"
                          name="maxCartQuantity"
                          value={formData.maxCartQuantity}
                          onChange={handleChange}
                          placeholder="10000"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Allowed Quantities</label>
                      <input
                        type="text"
                        name="allowedQuantities"
                        value={formData.allowedQuantities}
                        onChange={handleChange}
                        placeholder="e.g., 1, 5, 10, 20"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Comma-separated list of quantities. Leave empty to allow any quantity.
                      </p>
                    </div>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="notReturnable"
                        checked={formData.notReturnable}
                        onChange={handleChange}
                        className="rounded"
                      />
                      <span className="text-sm">Not returnable</span>
                    </label>
                  </div>
                </TabsContent>

                {/* Shipping Tab */}
                <TabsContent value="shipping" className="space-y-6 mt-6">
                  {/* Shipping Enabled */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Shipping Settings</h3>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isShipEnabled"
                        checked={formData.isShipEnabled}
                        onChange={handleChange}
                        className="rounded"
                      />
                      <span className="text-sm">Shipping enabled</span>
                    </label>

                    {formData.isShipEnabled && (
                      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-3">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="isFreeShipping"
                              checked={formData.isFreeShipping}
                              onChange={handleChange}
                              className="rounded"
                            />
                            <span className="text-sm">Free shipping</span>
                          </label>

                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="shipSeparately"
                              checked={formData.shipSeparately}
                              onChange={handleChange}
                              className="rounded"
                            />
                            <span className="text-sm">Ship separately (not with other products)</span>
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Additional Shipping Charge ($)</label>
                          <input
                            type="number"
                            name="additionalShippingCharge"
                            value={formData.additionalShippingCharge}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Delivery Date</label>
                          <select
                            name="deliveryDateId"
                            value={formData.deliveryDateId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">None</option>
                            <option value="1">1-2 days</option>
                            <option value="2">3-5 days</option>
                            <option value="3">1 week</option>
                            <option value="4">2 weeks</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dimensions */}
                  {formData.isShipEnabled && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Dimensions</h3>

                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                          <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Length (cm)</label>
                          <input
                            type="number"
                            name="length"
                            value={formData.length}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Width (cm)</label>
                          <input
                            type="number"
                            name="width"
                            value={formData.width}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Height (cm)</label>
                          <input
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Related Products Tab */}
                <TabsContent value="related-products" className="space-y-6 mt-6">
                  {/* Related Products Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Related Products</h3>
                    <p className="text-sm text-muted-foreground">
                      These products will be shown on the product details page as recommended items
                    </p>

                    {/* Selected Related Products */}
                    {formData.relatedProducts.length > 0 && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Selected Products</label>
                        <div className="border rounded-lg p-4 space-y-2">
                          {formData.relatedProducts.map((productId) => {
                            const product = availableProducts.find(p => p.id === productId);
                            return product ? (
                              <div
                                key={productId}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                    <Package className="h-5 w-5 text-gray-500" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      SKU: {product.sku} • {product.price}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeRelatedProduct(productId)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Search and Add */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Add Related Products</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search products by name or SKU..."
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Search Results */}
                      {searchTerm && (
                        <div className="mt-2 border rounded-lg max-h-64 overflow-y-auto">
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                              <div
                                key={product.id}
                                className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                                onClick={() => addRelatedProduct(product.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                    <Package className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      SKU: {product.sku} • {product.price}
                                    </p>
                                  </div>
                                </div>
                                {formData.relatedProducts.includes(product.id) ? (
                                  <Badge variant="secondary">Added</Badge>
                                ) : (
                                  <Button variant="ghost" size="sm">
                                    Add
                                  </Button>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              No products found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cross-sell Products Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Cross-sell Products</h3>
                    <p className="text-sm text-muted-foreground">
                      These products will be shown in the shopping cart as additional items
                    </p>

                    {/* Selected Cross-sell Products */}
                    {formData.crossSellProducts.length > 0 && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Selected Products</label>
                        <div className="border rounded-lg p-4 space-y-2">
                          {formData.crossSellProducts.map((productId) => {
                            const product = availableProducts.find(p => p.id === productId);
                            return product ? (
                              <div
                                key={productId}
                                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      SKU: {product.sku} • {product.price}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeCrossSellProduct(productId)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Search and Add */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Add Cross-sell Products</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={searchTermCross}
                          onChange={(e) => setSearchTermCross(e.target.value)}
                          placeholder="Search products by name or SKU..."
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Search Results */}
                      {searchTermCross && (
                        <div className="mt-2 border rounded-lg max-h-64 overflow-y-auto">
                          {filteredProductsCross.length > 0 ? (
                            filteredProductsCross.map((product) => (
                              <div
                                key={product.id}
                                className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                                onClick={() => addCrossSellProduct(product.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                    <ShoppingCart className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      SKU: {product.sku} • {product.price}
                                    </p>
                                  </div>
                                </div>
                                {formData.crossSellProducts.includes(product.id) ? (
                                  <Badge variant="secondary">Added</Badge>
                                ) : (
                                  <Button variant="ghost" size="sm">
                                    Add
                                  </Button>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              No products found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-sm text-blue-900 mb-2">Tips</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>Related Products:</strong> Shown on product detail page to encourage additional purchases</li>
                      <li>• <strong>Cross-sell Products:</strong> Displayed in the cart to suggest complementary items</li>
                      <li>• Select products that complement or enhance the main product</li>
                    </ul>
                  </div>
                </TabsContent>

                {/* Attributes Tab */}
                <TabsContent value="attributes" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Product Attributes</h3>
                        <p className="text-sm text-muted-foreground">
                          Add attributes like size, color, material to create product variations
                        </p>
                      </div>
                      <Button onClick={addAttribute} variant="outline">
                        <Tag className="mr-2 h-4 w-4" />
                        Add Attribute
                      </Button>
                    </div>

                    {attributes.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Attributes Yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Click "Add Attribute" to create product variations
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {attributes.map((attribute, attrIdx) => (
                          <Card key={attribute.id} className="border-2">
                            <CardContent className="p-4">
                              <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                  <div className="flex-1">
                                    <label className="block text-sm font-medium mb-2">
                                      Attribute Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={attribute.name}
                                      onChange={(e) => updateAttributeName(attribute.id, e.target.value)}
                                      placeholder="e.g., Size, Color, Material"
                                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeAttribute(attribute.id)}
                                    className="mt-7"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium mb-2">Values</label>
                                  <div className="space-y-2">
                                    {attribute.values.map((value, valueIdx) => (
                                      <div key={valueIdx} className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          value={value}
                                          onChange={(e) => updateAttributeValue(attribute.id, valueIdx, e.target.value)}
                                          placeholder="e.g., Small, Red, Cotton"
                                          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        {attribute.values.length > 1 && (
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeAttributeValue(attribute.id, valueIdx)}
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => addAttributeValue(attribute.id)}
                                      className="w-full"
                                    >
                                      + Add Value
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Info Box */}
                    {formData.productType === 'grouped' && attributes.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-sm text-blue-900 mb-2">Product Variations</h4>
                        <p className="text-sm text-blue-800">
                          With the attributes you've added, you can create {
                            attributes.reduce((acc, attr) => acc * attr.values.filter(v => v).length, 1)
                          } product variations. Each variation will have its own price, SKU, and inventory.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Additional Options */}
        <div className="col-span-3 space-y-6">
          {/* Pictures Card */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Image className="h-4 w-4" />
                Pictures
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm font-medium mb-1">Upload Images</p>
                  <p className="text-xs text-gray-600 mb-3">
                    JPG, PNG (Max 5MB)
                  </p>
                  <Button variant="outline" size="sm">
                    Browse
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Card */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Search className="h-4 w-4" />
                SEO
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Title</label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleChange}
                    placeholder="SEO title"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Meta Description</label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleChange}
                    placeholder="Brief description for search engines"
                    rows={3}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">URL Slug</label>
                  <input
                    type="text"
                    name="searchEngineFriendlyPageName"
                    value={formData.searchEngineFriendlyPageName}
                    onChange={handleChange}
                    placeholder="product-url-slug"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Types Card */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Product Types
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isDownload"
                    checked={formData.isDownload}
                    onChange={handleChange}
                    className="rounded"
                  />
                  <span className="text-sm">Downloadable product</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isRecurring"
                    checked={formData.isRecurring}
                    onChange={handleChange}
                    className="rounded"
                  />
                  <span className="text-sm">Recurring product</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isRental"
                    checked={formData.isRental}
                    onChange={handleChange}
                    className="rounded"
                  />
                  <span className="text-sm">Rental product</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isGiftCard"
                    checked={formData.isGiftCard}
                    onChange={handleChange}
                    className="rounded"
                  />
                  <span className="text-sm">Gift card</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Preview Product
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Copy Product Link
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-red-600 hover:text-red-700">
                  <X className="mr-2 h-4 w-4" />
                  Delete Product
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
