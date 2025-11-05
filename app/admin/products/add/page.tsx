"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, Save, Upload, X, Info, Search, Image, Package,
  Tag, BarChart3, Globe, Settings, Truck, Gift, Calendar,
  Users, DollarSign, Shield, FileText, Link as LinkIcon, ShoppingCart, Video
} from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermCross, setSearchTermCross] = useState('');
  const [attributes, setAttributes] = useState<Array<{id: string, name: string, values: string[]}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // New fields for additional tabs
    productImages: [] as Array<{id: string, url: string, altText: string, displayOrder: number}>,
    videoUrls: [] as string[],
    specifications: [] as Array<{id: string, name: string, value: string, displayOrder: number}>,

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

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.name || !formData.sku) {
        alert('Please fill in required fields: Product Name and SKU');
        return;
      }

      // Prepare categoryId - ensure it's a valid GUID or null
      const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      let categoryId: string | null = null;
      if (formData.categories) {
        const trimmedCategory = formData.categories.trim();
        if (trimmedCategory !== '' && guidRegex.test(trimmedCategory)) {
          categoryId = trimmedCategory;
        }
      }

      // Prepare product data for API - matching backend CreateProductCommand structure
      const productData: any = {
        // Basic Info
        name: formData.name,
        description: formData.fullDescription || formData.shortDescription || formData.name || 'Product description',
        shortDescription: formData.shortDescription || '',
        sku: formData.sku,
        gtin: formData.gtin || null,
        manufacturerPartNumber: formData.manufacturerPartNumber || null,
        displayOrder: parseInt(formData.displayOrder) || 1,
        adminComment: formData.adminComment || null,

        // Pricing
        price: parseFloat(formData.price) || 0,
        oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
        compareAtPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
        costPrice: formData.cost ? parseFloat(formData.cost) : null,

        // Shipping
        weight: parseFloat(formData.weight) || 0,
        length: formData.length ? parseFloat(formData.length) : null,
        width: formData.width ? parseFloat(formData.width) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        requiresShipping: true,

        // Inventory
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        trackQuantity: true,

        // Category - must be valid GUID
        categoryId: categoryId,

        // Availability
        availableStartDate: formData.availableStartDate || null,
        availableEndDate: formData.availableEndDate || null,

        // Status
        isPublished: isDraft ? false : formData.published,
        status: isDraft ? 1 : 2,
        visibleIndividually: formData.visibleIndividually,
        showOnHomepage: formData.showOnHomepage || false,

        // SEO
        metaTitle: formData.metaTitle || null,
        metaDescription: formData.metaDescription || null,
        metaKeywords: formData.metaKeywords || null,

        // Foreign Keys (set to null if not selected)
        brandId: null,
        manufacturerId: null,

        // Additional
        manufacturer: formData.manufacturer || null,
        vendor: formData.manufacturer || null,
        tags: formData.productTags || null,
        relatedProductIds: Array.isArray(formData.relatedProducts) && formData.relatedProducts.length > 0 ? formData.relatedProducts.join(',') : null,
        crossSellProductIds: Array.isArray(formData.crossSellProducts) && formData.crossSellProducts.length > 0 ? formData.crossSellProducts.join(',') : null,
      };

      console.log('Submitting product data:', productData);
      console.log('CategoryId being sent:', categoryId);

      // Call API
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5285';
      const response = await fetch(`${apiUrl}/api/Products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        try {
          const result = await response.json();
          console.log('Product created successfully:', result);
          alert(isDraft ? 'Product saved as draft!' : 'Product created successfully!');
          router.push('/admin/products');
        } catch (err) {
          console.log('Product created (no JSON response)');
          alert(isDraft ? 'Product saved as draft!' : 'Product created successfully!');
          router.push('/admin/products');
        }
      } else {
        try {
          const errorText = await response.text();
          console.error('Error creating product:', errorText);

          // Try to parse as JSON
          try {
            const errorJson = JSON.parse(errorText);

            // Check if there are validation errors
            if (errorJson.errors) {
              let errorMessage = 'Validation errors:\n';
              for (const [field, messages] of Object.entries(errorJson.errors)) {
                const fieldName = field.replace('$', '').replace('.', ' ');
                errorMessage += `\n${fieldName}: ${(messages as string[]).join(', ')}`;
              }
              alert(errorMessage);
            } else {
              alert('Error creating product: ' + (errorJson.message || errorJson.title || 'Unknown error'));
            }
          } catch {
            alert('Error creating product: ' + (errorText || `Status: ${response.status}`));
          }
        } catch (err) {
          alert('Error creating product: Status ' + response.status);
        }
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file, index) => ({
        id: `${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        altText: '',
        displayOrder: formData.productImages.length + index + 1,
        file: file
      }));

      setFormData({
        ...formData,
        productImages: [...formData.productImages, ...newImages as any]
      });
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (imageId: string) => {
    setFormData({
      ...formData,
      productImages: formData.productImages.filter(img => img.id !== imageId)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/products">
              <button className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                <ArrowLeft className="h-5 w-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
                Add a New Product
              </h1>
              <p className="text-sm text-slate-400 mt-1">Create and configure your product details</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition-all text-sm font-medium flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="px-5 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/50 transition-all text-sm flex items-center gap-2 font-semibold"
            >
              <Save className="h-4 w-4" />
              Save & Continue
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full">
        {/* Main Form */}
        <div className="w-full">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <Tabs defaultValue="product-info" className="w-full">
              <div className="border-b border-slate-800 mb-6">
                <TabsList className="flex gap-1 overflow-x-auto pb-px scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent bg-transparent h-auto p-0">
                  <TabsTrigger value="product-info" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-violet-400 border-b-2 border-transparent data-[state=active]:border-violet-500 data-[state=active]:text-violet-400 data-[state=active]:bg-slate-800/50 whitespace-nowrap transition-all rounded-t-lg">
                    <Info className="h-4 w-4" />
                    Product Info
                  </TabsTrigger>
                  <TabsTrigger value="prices" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-violet-400 border-b-2 border-transparent data-[state=active]:border-violet-500 data-[state=active]:text-violet-400 data-[state=active]:bg-slate-800/50 whitespace-nowrap transition-all rounded-t-lg">
                    <DollarSign className="h-4 w-4" />
                    Prices
                  </TabsTrigger>
                  <TabsTrigger value="inventory" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-violet-400 border-b-2 border-transparent data-[state=active]:border-violet-500 data-[state=active]:text-violet-400 data-[state=active]:bg-slate-800/50 whitespace-nowrap transition-all rounded-t-lg">
                    <Package className="h-4 w-4" />
                    Inventory
                  </TabsTrigger>
                  <TabsTrigger value="shipping" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-violet-400 border-b-2 border-transparent data-[state=active]:border-violet-500 data-[state=active]:text-violet-400 data-[state=active]:bg-slate-800/50 whitespace-nowrap transition-all rounded-t-lg">
                    <Truck className="h-4 w-4" />
                    Shipping
                  </TabsTrigger>
                  <TabsTrigger value="related-products" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-violet-400 border-b-2 border-transparent data-[state=active]:border-violet-500 data-[state=active]:text-violet-400 data-[state=active]:bg-slate-800/50 whitespace-nowrap transition-all rounded-t-lg">
                    <LinkIcon className="h-4 w-4" />
                    Related
                  </TabsTrigger>
                  <TabsTrigger value="attributes" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-violet-400 border-b-2 border-transparent data-[state=active]:border-violet-500 data-[state=active]:text-violet-400 data-[state=active]:bg-slate-800/50 whitespace-nowrap transition-all rounded-t-lg">
                    <Tag className="h-4 w-4" />
                    Attributes
                  </TabsTrigger>
                  <TabsTrigger value="seo" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-violet-400 border-b-2 border-transparent data-[state=active]:border-violet-500 data-[state=active]:text-violet-400 data-[state=active]:bg-slate-800/50 whitespace-nowrap transition-all rounded-t-lg">
                    <Globe className="h-4 w-4" />
                    SEO
                  </TabsTrigger>
                  <TabsTrigger value="pictures" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-violet-400 border-b-2 border-transparent data-[state=active]:border-violet-500 data-[state=active]:text-violet-400 data-[state=active]:bg-slate-800/50 whitespace-nowrap transition-all rounded-t-lg">
                    <Image className="h-4 w-4" />
                    Pictures
                  </TabsTrigger>
                  <TabsTrigger value="videos" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-violet-400 border-b-2 border-transparent data-[state=active]:border-violet-500 data-[state=active]:text-violet-400 data-[state=active]:bg-slate-800/50 whitespace-nowrap transition-all rounded-t-lg">
                    <Video className="h-4 w-4" />
                    Videos
                  </TabsTrigger>
                  <TabsTrigger value="specifications" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-violet-400 border-b-2 border-transparent data-[state=active]:border-violet-500 data-[state=active]:text-violet-400 data-[state=active]:bg-slate-800/50 whitespace-nowrap transition-all rounded-t-lg">
                    <BarChart3 className="h-4 w-4" />
                    Specifications
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Product Info Tab */}
              <TabsContent value="product-info" className="space-y-6 mt-6">
                {/* Basic Info Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Basic Info</h3>

                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Short Description
                      </label>
                      <textarea
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        placeholder="Brief product description (shown in product lists)"
                        rows={3}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Full Description
                      </label>
                      <textarea
                        name="fullDescription"
                        value={formData.fullDescription}
                        onChange={handleChange}
                        placeholder="Detailed product description with features and specifications"
                        rows={8}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-slate-400 mt-1">HTML markup is supported</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          SKU <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="sku"
                          value={formData.sku}
                          onChange={handleChange}
                          placeholder="e.g., PROD-001"
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Categories</label>
                        <select
                          name="categories"
                          value={formData.categories}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
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
                        <label className="block text-sm font-medium text-slate-300 mb-2">Manufacturer</label>
                        <input
                          type="text"
                          name="manufacturer"
                          value={formData.manufacturer}
                          onChange={handleChange}
                          placeholder="Manufacturer/Brand name"
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Product Type</label>
                        <select
                          name="productType"
                          value={formData.productType}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        >
                          <option value="simple">Simple Product</option>
                          <option value="grouped">Grouped Product (product variants)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">GTIN</label>
                        <input
                          type="text"
                          name="gtin"
                          value={formData.gtin}
                          onChange={handleChange}
                          placeholder="Global Trade Item Number"
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Manufacturer Part Number</label>
                        <input
                          type="text"
                          name="manufacturerPartNumber"
                          value={formData.manufacturerPartNumber}
                          onChange={handleChange}
                          placeholder="MPN"
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Display Order</label>
                        <input
                          type="number"
                          name="displayOrder"
                          value={formData.displayOrder}
                          onChange={handleChange}
                          placeholder="1"
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Product Tags</label>
                      <input
                        type="text"
                        name="productTags"
                        value={formData.productTags}
                        onChange={handleChange}
                        placeholder="tag1, tag2, tag3"
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-slate-400 mt-1">Comma-separated tags</p>
                    </div>
                  </div>
                </div>

                {/* Publishing Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Publishing</h3>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="published"
                        checked={formData.published}
                        onChange={handleChange}
                        className="rounded bg-slate-800/50 border-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-900"
                      />
                      <span className="text-sm text-slate-300">Published</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="visibleIndividually"
                        checked={formData.visibleIndividually}
                        onChange={handleChange}
                        className="rounded bg-slate-800/50 border-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-900"
                      />
                      <span className="text-sm text-slate-300">Visible individually</span>
                      <span className="text-xs text-slate-400">(can be accessed from catalog)</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="showOnHomepage"
                        checked={formData.showOnHomepage}
                        onChange={handleChange}
                        className="rounded bg-slate-800/50 border-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-900"
                      />
                      <span className="text-sm text-slate-300">Show on home page</span>
                    </label>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Available Start Date/Time</label>
                      <input
                        type="datetime-local"
                        name="availableStartDate"
                        value={formData.availableStartDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Available End Date/Time</label>
                      <input
                        type="datetime-local"
                        name="availableEndDate"
                        value={formData.availableEndDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Admin Comment */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Admin Comment</h3>
                  <div>
                    <textarea
                      name="adminComment"
                      value={formData.adminComment}
                      onChange={handleChange}
                      placeholder="Internal notes (not visible to customers)"
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Prices Tab */}
              <TabsContent value="prices" className="space-y-6 mt-6">
                {/* Price Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Price</h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Price ($) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Old Price ($)</label>
                      <input
                        type="number"
                        name="oldPrice"
                        value={formData.oldPrice}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-slate-400 mt-1">Shows as strikethrough</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Product Cost ($)</label>
                      <input
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-slate-400 mt-1">For profit calculation</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="disableBuyButton"
                        checked={formData.disableBuyButton}
                        onChange={handleChange}
                        className="rounded bg-slate-800/50 border-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-900"
                      />
                      <span className="text-sm text-slate-300">Disable buy button</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="disableWishlistButton"
                        checked={formData.disableWishlistButton}
                        onChange={handleChange}
                        className="rounded bg-slate-800/50 border-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-900"
                      />
                      <span className="text-sm text-slate-300">Disable wishlist button</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="callForPrice"
                        checked={formData.callForPrice}
                        onChange={handleChange}
                        className="rounded bg-slate-800/50 border-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-900"
                      />
                      <span className="text-sm text-slate-300">Call for price</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="customerEntersPrice"
                        checked={formData.customerEntersPrice}
                        onChange={handleChange}
                        className="rounded bg-slate-800/50 border-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-900"
                      />
                      <span className="text-sm text-slate-300">Customer enters price</span>
                    </label>
                  </div>

                  {formData.customerEntersPrice && (
                    <div className="grid md:grid-cols-2 gap-4 bg-slate-800/30 border border-slate-700 p-4 rounded-xl">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Minimum Amount</label>
                        <input
                          type="number"
                          name="minimumCustomerEnteredPrice"
                          value={formData.minimumCustomerEnteredPrice}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Maximum Amount</label>
                        <input
                          type="number"
                          name="maximumCustomerEnteredPrice"
                          value={formData.maximumCustomerEnteredPrice}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Pre-order Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Pre-order</h3>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="availableForPreOrder"
                      checked={formData.availableForPreOrder}
                      onChange={handleChange}
                      className="rounded bg-slate-800/50 border-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-sm text-slate-300">Available for pre-order</span>
                  </label>

                  {formData.availableForPreOrder && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Pre-order Availability Start Date</label>
                      <input
                        type="datetime-local"
                        name="preOrderAvailabilityStartDate"
                        value={formData.preOrderAvailabilityStartDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      />
                    </div>
                  )}
                </div>

                {/* Mark as New Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Mark as New</h3>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="markAsNew"
                      checked={formData.markAsNew}
                      onChange={handleChange}
                      className="rounded bg-slate-800/50 border-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-sm text-slate-300">Mark as new product</span>
                  </label>

                  {formData.markAsNew && (
                    <div className="grid md:grid-cols-2 gap-4 bg-slate-800/30 border border-slate-700 p-4 rounded-xl">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
                        <input
                          type="datetime-local"
                          name="markAsNewStartDate"
                          value={formData.markAsNewStartDate}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
                        <input
                          type="datetime-local"
                          name="markAsNewEndDate"
                          value={formData.markAsNewEndDate}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Tax Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Tax</h3>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="taxExempt"
                      checked={formData.taxExempt}
                      onChange={handleChange}
                      className="rounded bg-slate-800/50 border-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-sm text-slate-300">Tax exempt</span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Tax Category</label>
                    <select
                      name="taxCategoryId"
                      value={formData.taxCategoryId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
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
                  <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Inventory Method</h3>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Inventory Method</label>
                    <select
                      name="manageInventory"
                      value={formData.manageInventory}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    >
                      <option value="dont-track">Don't track inventory</option>
                      <option value="track">Track inventory</option>
                      <option value="track-by-attributes">Track inventory by product attributes</option>
                    </select>
                    <p className="text-xs text-slate-400 mt-1">
                      Choose how you want to manage inventory for this product
                    </p>
                  </div>
                </div>

                {/* Inventory Settings */}
                {formData.manageInventory === 'track' && (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Stock Quantity</h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Stock Quantity <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="stockQuantity"
                            value={formData.stockQuantity}
                            onChange={handleChange}
                            placeholder="0"
                            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Minimum Stock Quantity</label>
                          <input
                            type="number"
                            name="minStockQuantity"
                            value={formData.minStockQuantity}
                            onChange={handleChange}
                            placeholder="0"
                            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Low Stock Activity</label>
                          <select
                            name="lowStockActivity"
                            value={formData.lowStockActivity}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                          >
                            <option value="nothing">Nothing</option>
                            <option value="disable-buy">Disable buy button</option>
                            <option value="unpublish">Unpublish product</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Notify Admin for Quantity Below</label>
                          <input
                            type="number"
                            name="notifyAdminForQuantityBelow"
                            value={formData.notifyAdminForQuantityBelow}
                            onChange={handleChange}
                            placeholder="1"
                            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Backorders</label>
                        <select
                          name="backorders"
                          value={formData.backorders}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
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
                            className="rounded bg-slate-800/50 border-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-900"
                          />
                          <span className="text-sm text-slate-300">Display stock availability</span>
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="displayStockQuantity"
                            checked={formData.displayStockQuantity}
                            onChange={handleChange}
                            className="rounded bg-slate-800/50 border-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-900"
                          />
                          <span className="text-sm text-slate-300">Display stock quantity</span>
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="allowBackInStockSubscriptions"
                            checked={formData.allowBackInStockSubscriptions}
                            onChange={handleChange}
                            className="rounded bg-slate-800/50 border-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-900"
                          />
                          <span className="text-sm text-slate-300">Allow back in stock subscriptions</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Multiple Warehouses</h3>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Product Availability Range</label>
                        <select
                          name="productAvailabilityRange"
                          value={formData.productAvailabilityRange}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
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
                  <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Cart Settings</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Minimum Cart Quantity</label>
                      <input
                        type="number"
                        name="minCartQuantity"
                        value={formData.minCartQuantity}
                        onChange={handleChange}
                        placeholder="1"
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Maximum Cart Quantity</label>
                      <input
                        type="number"
                        name="maxCartQuantity"
                        value={formData.maxCartQuantity}
                        onChange={handleChange}
                        placeholder="10000"
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Allowed Quantities</label>
                    <input
                      type="text"
                      name="allowedQuantities"
                      value={formData.allowedQuantities}
                      onChange={handleChange}
                      placeholder="e.g., 1, 5, 10, 20"
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Comma-separated list of quantities. Leave empty to allow any quantity.
                    </p>
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="notReturnable"
                      checked={formData.notReturnable}
                      onChange={handleChange}
                      className="rounded bg-slate-800/50 border-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-sm text-slate-300">Not returnable</span>
                  </label>
                </div>
              </TabsContent>

              {/* Shipping Tab */}
              <TabsContent value="shipping" className="space-y-6 mt-6">
                {/* Shipping Enabled */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Shipping Settings</h3>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isShipEnabled"
                      checked={formData.isShipEnabled}
                      onChange={handleChange}
                      className="rounded bg-slate-800/50 border-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-sm text-slate-300">Shipping enabled</span>
                  </label>

                  {formData.isShipEnabled && (
                    <div className="space-y-4 bg-slate-800/30 border border-slate-700 p-4 rounded-xl">
                      <div className="space-y-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="isFreeShipping"
                            checked={formData.isFreeShipping}
                            onChange={handleChange}
                            className="rounded bg-slate-800/50 border-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-900"
                          />
                          <span className="text-sm text-slate-300">Free shipping</span>
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="shipSeparately"
                            checked={formData.shipSeparately}
                            onChange={handleChange}
                            className="rounded bg-slate-800/50 border-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-900"
                          />
                          <span className="text-sm text-slate-300">Ship separately (not with other products)</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Additional Shipping Charge ($)</label>
                        <input
                          type="number"
                          name="additionalShippingCharge"
                          value={formData.additionalShippingCharge}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Delivery Date</label>
                        <select
                          name="deliveryDateId"
                          value={formData.deliveryDateId}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
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
                    <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Dimensions</h3>

                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Weight (kg)</label>
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Length (cm)</label>
                        <input
                          type="number"
                          name="length"
                          value={formData.length}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Width (cm)</label>
                        <input
                          type="number"
                          name="width"
                          value={formData.width}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Height (cm)</label>
                        <input
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
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
                  <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Related Products</h3>
                  <p className="text-sm text-slate-400">
                    These products will be shown on the product details page as recommended items
                  </p>

                  {/* Selected Related Products */}
                  {formData.relatedProducts.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">Selected Products</label>
                      <div className="border border-slate-700 rounded-xl p-4 space-y-2 bg-slate-800/30">
                        {formData.relatedProducts.map((productId) => {
                          const product = availableProducts.find(p => p.id === productId);
                          return product ? (
                            <div
                              key={productId}
                              className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-700/50 rounded flex items-center justify-center">
                                  <Package className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm text-white">{product.name}</p>
                                  <p className="text-xs text-slate-400">
                                    SKU: {product.sku} • {product.price}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => removeRelatedProduct(productId)}
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {/* Search and Add */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Add Related Products</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products by name or SKU..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Search Results */}
                    {searchTerm && (
                      <div className="mt-2 border border-slate-700 rounded-xl max-h-64 overflow-y-auto bg-slate-800/30">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center justify-between p-3 hover:bg-slate-800/50 cursor-pointer border-b border-slate-700 last:border-0 transition-all"
                              onClick={() => addRelatedProduct(product.id)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-700/50 rounded flex items-center justify-center">
                                  <Package className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm text-white">{product.name}</p>
                                  <p className="text-xs text-slate-400">
                                    SKU: {product.sku} • {product.price}
                                  </p>
                                </div>
                              </div>
                              {formData.relatedProducts.includes(product.id) ? (
                                <span className="px-2 py-1 bg-violet-500/20 text-violet-400 text-xs rounded-lg border border-violet-500/30">Added</span>
                              ) : (
                                <button className="px-3 py-1 bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700 rounded-lg text-xs transition-all">
                                  Add
                                </button>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-sm text-slate-400">
                            No products found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Cross-sell Products Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Cross-sell Products</h3>
                  <p className="text-sm text-slate-400">
                    These products will be shown in the shopping cart as additional items
                  </p>

                  {/* Selected Cross-sell Products */}
                  {formData.crossSellProducts.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">Selected Products</label>
                      <div className="border border-slate-700 rounded-xl p-4 space-y-2 bg-slate-800/30">
                        {formData.crossSellProducts.map((productId) => {
                          const product = availableProducts.find(p => p.id === productId);
                          return product ? (
                            <div
                              key={productId}
                              className="flex items-center justify-between p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-cyan-500/20 rounded flex items-center justify-center">
                                  <ShoppingCart className="h-5 w-5 text-cyan-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm text-white">{product.name}</p>
                                  <p className="text-xs text-slate-400">
                                    SKU: {product.sku} • {product.price}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => removeCrossSellProduct(productId)}
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {/* Search and Add */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Add Cross-sell Products</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchTermCross}
                        onChange={(e) => setSearchTermCross(e.target.value)}
                        placeholder="Search products by name or SKU..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Search Results */}
                    {searchTermCross && (
                      <div className="mt-2 border border-slate-700 rounded-xl max-h-64 overflow-y-auto bg-slate-800/30">
                        {filteredProductsCross.length > 0 ? (
                          filteredProductsCross.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center justify-between p-3 hover:bg-slate-800/50 cursor-pointer border-b border-slate-700 last:border-0 transition-all"
                              onClick={() => addCrossSellProduct(product.id)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-700/50 rounded flex items-center justify-center">
                                  <ShoppingCart className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm text-white">{product.name}</p>
                                  <p className="text-xs text-slate-400">
                                    SKU: {product.sku} • {product.price}
                                  </p>
                                </div>
                              </div>
                              {formData.crossSellProducts.includes(product.id) ? (
                                <span className="px-2 py-1 bg-violet-500/20 text-violet-400 text-xs rounded-lg border border-violet-500/30">Added</span>
                              ) : (
                                <button className="px-3 py-1 bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700 rounded-lg text-xs transition-all">
                                  Add
                                </button>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-sm text-slate-400">
                            No products found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
                  <h4 className="font-semibold text-sm text-violet-400 mb-2">Tips</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• <strong className="text-white">Related Products:</strong> Shown on product detail page to encourage additional purchases</li>
                    <li>• <strong className="text-white">Cross-sell Products:</strong> Displayed in the cart to suggest complementary items</li>
                    <li>• Select products that complement or enhance the main product</li>
                  </ul>
                </div>
              </TabsContent>

              {/* Attributes Tab */}
              <TabsContent value="attributes" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Product Attributes</h3>
                      <p className="text-sm text-slate-400">
                        Add attributes like size, color, material to create product variations
                      </p>
                    </div>
                    <button
                      onClick={addAttribute}
                      className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 transition-all text-sm flex items-center gap-2"
                    >
                      <Tag className="h-4 w-4" />
                      Add Attribute
                    </button>
                  </div>

                  {attributes.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/20">
                      <Package className="mx-auto h-16 w-16 text-slate-600 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">No Attributes Yet</h3>
                      <p className="text-slate-400 mb-4">
                        Click "Add Attribute" to create product variations
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {attributes.map((attribute, attrIdx) => (
                        <div key={attribute.id} className="bg-slate-800/30 border border-slate-700 rounded-xl p-4">
                          <div className="space-y-4">
                            <div className="flex items-start gap-4">
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                  Attribute Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={attribute.name}
                                  onChange={(e) => updateAttributeName(attribute.id, e.target.value)}
                                  placeholder="e.g., Size, Color, Material"
                                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                />
                              </div>
                              <button
                                onClick={() => removeAttribute(attribute.id)}
                                className="mt-7 p-2 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 rounded-lg transition-all"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Values</label>
                              <div className="space-y-2">
                                {attribute.values.map((value, valueIdx) => (
                                  <div key={valueIdx} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={value}
                                      onChange={(e) => updateAttributeValue(attribute.id, valueIdx, e.target.value)}
                                      placeholder="e.g., Small, Red, Cotton"
                                      className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                    {attribute.values.length > 1 && (
                                      <button
                                        onClick={() => removeAttributeValue(attribute.id, valueIdx)}
                                        className="p-2 bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/30 rounded-lg transition-all"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                                <button
                                  onClick={() => addAttributeValue(attribute.id)}
                                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 transition-all text-sm"
                                >
                                  + Add Value
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Info Box */}
                  {formData.productType === 'grouped' && attributes.length > 0 && (
                    <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
                      <h4 className="font-semibold text-sm text-violet-400 mb-2">Product Variations</h4>
                      <p className="text-sm text-slate-300">
                        With the attributes you've added, you can create {
                          attributes.reduce((acc, attr) => acc * attr.values.filter(v => v).length, 1)
                        } product variations. Each variation will have its own price, SKU, and inventory.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* SEO Tab */}
              <TabsContent value="seo" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Search Engine Optimization</h3>
                  <p className="text-sm text-slate-400">
                    Optimize your product for search engines to improve visibility
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Meta Title</label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleChange}
                      placeholder="SEO-optimized title for search engines"
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-slate-400 mt-1">Recommended: 50-60 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Meta Description</label>
                    <textarea
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleChange}
                      placeholder="Brief description for search engine results"
                      rows={4}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-slate-400 mt-1">Recommended: 150-160 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Meta Keywords</label>
                    <input
                      type="text"
                      name="metaKeywords"
                      value={formData.metaKeywords}
                      onChange={handleChange}
                      placeholder="keyword1, keyword2, keyword3"
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-slate-400 mt-1">Comma-separated keywords</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Search Engine Friendly Page Name</label>
                    <input
                      type="text"
                      name="searchEngineFriendlyPageName"
                      value={formData.searchEngineFriendlyPageName}
                      onChange={handleChange}
                      placeholder="product-url-slug"
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-slate-400 mt-1">Leave empty to auto-generate from product name</p>
                  </div>

                  <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
                    <h4 className="font-semibold text-sm text-violet-400 mb-2">SEO Tips</h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Use descriptive, keyword-rich titles and descriptions</li>
                      <li>• Keep meta titles under 60 characters</li>
                      <li>• Keep meta descriptions under 160 characters</li>
                      <li>• Use hyphens in URL slugs (e.g., wireless-headphones)</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* Pictures Tab */}
              <TabsContent value="pictures" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Product Images</h3>
                  <p className="text-sm text-slate-400">
                    Upload and manage product images. First image will be the main product image.
                  </p>

                  {/* Image Upload Area */}
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 bg-slate-800/20 hover:border-violet-500/50 transition-all">
                    <div className="text-center">
                      <Upload className="mx-auto h-16 w-16 text-slate-500 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">Upload Product Images</h3>
                      <p className="text-sm text-slate-400 mb-4">
                        Drag and drop images here, or click to browse
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={handleBrowseClick}
                        className="px-6 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800 transition-all text-sm font-medium"
                      >
                        Browse Files
                      </button>
                      <p className="text-xs text-slate-400 mt-3">
                        Supported: JPG, PNG, WebP (Max 5MB each)
                      </p>
                    </div>
                  </div>

                  {/* Image Preview Grid */}
                  {formData.productImages.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-slate-300">Uploaded Images ({formData.productImages.length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {formData.productImages.map((image) => (
                          <div key={image.id} className="bg-slate-800/30 border border-slate-700 rounded-xl p-3 space-y-3">
                            <div className="aspect-square bg-slate-700/50 rounded-lg flex items-center justify-center overflow-hidden">
                              {image.url ? (
                                <img src={image.url} alt={image.altText || 'Product image'} className="w-full h-full object-cover" />
                              ) : (
                                <Image className="h-12 w-12 text-slate-500" />
                              )}
                            </div>
                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="Alt text"
                                value={image.altText}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    productImages: formData.productImages.map(img =>
                                      img.id === image.id ? { ...img, altText: e.target.value } : img
                                    )
                                  });
                                }}
                                className="w-full px-2 py-1.5 text-xs bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                              />
                              <input
                                type="number"
                                placeholder="Display order"
                                value={image.displayOrder}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    productImages: formData.productImages.map(img =>
                                      img.id === image.id ? { ...img, displayOrder: parseInt(e.target.value) || 0 } : img
                                    )
                                  });
                                }}
                                className="w-full px-2 py-1.5 text-xs bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(image.id)}
                                className="w-full px-2 py-1.5 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 rounded-lg text-xs transition-all flex items-center justify-center gap-1"
                              >
                                <X className="h-3 w-3" />
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-slate-700 rounded-xl bg-slate-800/20">
                      <Image className="mx-auto h-12 w-12 text-slate-600 mb-2" />
                      <p className="text-sm text-slate-400">No images uploaded yet</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Videos Tab */}
              <TabsContent value="videos" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Product Videos</h3>
                  <p className="text-sm text-slate-400">
                    Add video URLs (YouTube, Vimeo, etc.) to showcase your product
                  </p>

                  {/* Video URL List */}
                  {formData.videoUrls.length > 0 && (
                    <div className="space-y-2">
                      {formData.videoUrls.map((url, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex-1 flex items-center gap-2 p-3 bg-slate-800/30 border border-slate-700 rounded-xl">
                            <Video className="h-4 w-4 text-slate-400 flex-shrink-0" />
                            <input
                              type="text"
                              value={url}
                              onChange={(e) => {
                                const newUrls = [...formData.videoUrls];
                                newUrls[index] = e.target.value;
                                setFormData({ ...formData, videoUrls: newUrls });
                              }}
                              placeholder="https://youtube.com/watch?v=..."
                              className="flex-1 px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                            />
                          </div>
                          <button
                            onClick={() => {
                              setFormData({
                                ...formData,
                                videoUrls: formData.videoUrls.filter((_, i) => i !== index)
                              });
                            }}
                            className="p-2.5 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 rounded-lg transition-all"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Video Button */}
                  <button
                    onClick={() => {
                      setFormData({
                        ...formData,
                        videoUrls: [...formData.videoUrls, '']
                      });
                    }}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800 transition-all text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Video className="h-4 w-4" />
                    Add Video URL
                  </button>

                  {formData.videoUrls.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/20">
                      <Video className="mx-auto h-16 w-16 text-slate-600 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">No Videos Added</h3>
                      <p className="text-slate-400 mb-4">
                        Click "Add Video URL" to embed product videos
                      </p>
                    </div>
                  )}

                  <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
                    <h4 className="font-semibold text-sm text-violet-400 mb-2">Supported Video Platforms</h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• YouTube (https://youtube.com/watch?v=...)</li>
                      <li>• Vimeo (https://vimeo.com/...)</li>
                      <li>• Direct video URLs (.mp4, .webm)</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* Specifications Tab */}
              <TabsContent value="specifications" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Product Specifications</h3>
                      <p className="text-sm text-slate-400">
                        Add technical specifications and product details
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setFormData({
                          ...formData,
                          specifications: [
                            ...formData.specifications,
                            { id: Date.now().toString(), name: '', value: '', displayOrder: formData.specifications.length + 1 }
                          ]
                        });
                      }}
                      className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 transition-all text-sm flex items-center gap-2"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Add Specification
                    </button>
                  </div>

                  {formData.specifications.length > 0 ? (
                    <div className="space-y-3">
                      {formData.specifications.map((spec) => (
                        <div key={spec.id} className="bg-slate-800/30 border border-slate-700 rounded-xl p-4">
                          <div className="grid md:grid-cols-12 gap-3">
                            <div className="md:col-span-4">
                              <label className="block text-sm font-medium text-slate-300 mb-2">Specification Name</label>
                              <input
                                type="text"
                                value={spec.name}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    specifications: formData.specifications.map(s =>
                                      s.id === spec.id ? { ...s, name: e.target.value } : s
                                    )
                                  });
                                }}
                                placeholder="e.g., Processor, RAM, Storage"
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                              />
                            </div>
                            <div className="md:col-span-5">
                              <label className="block text-sm font-medium text-slate-300 mb-2">Value</label>
                              <input
                                type="text"
                                value={spec.value}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    specifications: formData.specifications.map(s =>
                                      s.id === spec.id ? { ...s, value: e.target.value } : s
                                    )
                                  });
                                }}
                                placeholder="e.g., Intel Core i7, 16GB, 512GB SSD"
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-300 mb-2">Order</label>
                              <input
                                type="number"
                                value={spec.displayOrder}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    specifications: formData.specifications.map(s =>
                                      s.id === spec.id ? { ...s, displayOrder: parseInt(e.target.value) || 0 } : s
                                    )
                                  });
                                }}
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                              />
                            </div>
                            <div className="md:col-span-1 flex items-end">
                              <button
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    specifications: formData.specifications.filter(s => s.id !== spec.id)
                                  });
                                }}
                                className="w-full p-2 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 rounded-lg transition-all"
                              >
                                <X className="h-4 w-4 mx-auto" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/20">
                      <BarChart3 className="mx-auto h-16 w-16 text-slate-600 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">No Specifications Added</h3>
                      <p className="text-slate-400 mb-4">
                        Click "Add Specification" to add technical details
                      </p>
                    </div>
                  )}

                  <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
                    <h4 className="font-semibold text-sm text-violet-400 mb-2">Specification Examples</h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• <strong>Electronics:</strong> Processor, RAM, Storage, Display Size, Battery</li>
                      <li>• <strong>Clothing:</strong> Material, Care Instructions, Country of Origin</li>
                      <li>• <strong>Furniture:</strong> Dimensions, Material, Weight Capacity, Assembly</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

    </div>
  );
}
