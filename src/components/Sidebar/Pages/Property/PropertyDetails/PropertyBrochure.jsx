import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';

// Register fonts if needed, otherwise use standard fonts
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
// });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#EE2529',
    paddingBottom: 15,
  },
  logo: {
    width: 140,
  },
  propertyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textTransform: 'uppercase',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  badge: {
    backgroundColor: '#EE2529',
    color: '#ffffff',
    padding: '4 10',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  secondaryBadge: {
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    padding: '4 10',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  heroImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    objectFit: 'cover',
    marginBottom: 25,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EE2529',
    marginBottom: 12,
    textTransform: 'uppercase',
    borderLeftWidth: 3,
    borderLeftColor: '#EE2529',
    paddingLeft: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  infoBox: {
    width: '48%',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 8,
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 12,
    color: '#1f2937',
    fontWeight: 'extrabold',
  },
  description: {
    fontSize: 11,
    color: '#4b5563',
    lineHeight: 1.6,
    textAlign: 'justify',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
    marginBottom: 8,
  },
  amenityDot: {
    width: 6,
    height: 6,
    backgroundColor: '#EE2529',
    borderRadius: 3,
    marginRight: 6,
  },
  amenityText: {
    fontSize: 10,
    color: '#374151',
    fontWeight: 'medium',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 9,
    color: '#9ca3af',
  },
  contactInfo: {
    textAlign: 'right',
  },
  contactText: {
    fontSize: 10,
    color: '#4b5563',
    fontWeight: 'bold',
  }
});

const PropertyBrochure = ({ property }) => {
  const mainImage = property.media?.[0]?.fileUrl;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.propertyTitle}>
            {property.microMarket || 'Commercial Property'}
          </Text>
          <Text style={{ fontSize: 10, color: '#EE2529', fontWeight: 'bold' }}>
            PRE-LEASE GRID
          </Text>
        </View>

        {/* Badges */}
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text>{property.propertyType}</Text>
          </View>
          {property.tenantType && (
            <View style={styles.secondaryBadge}>
              <Text>{property.tenantType} Client</Text>
            </View>
          )}
          <View style={styles.secondaryBadge}>
            <Text>{property.buildingGrade || 'Grade A'}</Text>
          </View>
        </View>

        {/* Hero Image */}
        {mainImage ? (
          <Image src={mainImage} style={styles.heroImage} />
        ) : (
            <View style={[styles.heroImage, { backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: '#9ca3af', fontSize: 20 }}>No Image Available</Text>
            </View>
        )}

        {/* Property Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Details</Text>
          <View style={styles.grid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Property ID</Text>
              <Text style={styles.infoValue}>{property.propertyId}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Price</Text>
              <Text style={styles.infoValue}>₹{property.sellingPrice} Cr</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Carpet Area</Text>
              <Text style={styles.infoValue}>{property.carpetArea} {property.carpetAreaUnit}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Gross Yield</Text>
              <Text style={styles.infoValue}>{property.grossRentalYield ? `${property.grossRentalYield}%` : 'N/A'}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{property.city}, {property.state}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Ownership</Text>
              <Text style={styles.infoValue}>{property.ownershipType}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
                Excellent {property.propertyType} property located at {property.city}, {property.state}. 
                Offering a great investment opportunity with an expected ROI of {property.grossRentalYield || "N/A"}%. 
                This property features {property.carpetArea} {property.carpetAreaUnit} of premium space in a 
                {property.buildingGrade || "Grade A"} building. The property is well-maintained with high-quality 
                infrastructure and modern amenities.
            </Text>
        </View>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {property.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <View style={styles.amenityDot} />
                  <Text style={styles.amenityText}>{amenity.amenityName}</Text>
                </View>
              ))}
              <View style={styles.amenityItem}>
                <View style={styles.amenityDot} />
                <Text style={styles.amenityText}>{property.powerBackup} Power Backup</Text>
              </View>
              <View style={styles.amenityItem}>
                <View style={styles.amenityDot} />
                <Text style={styles.amenityText}>{property.parkingFourWheeler} Car Parking</Text>
              </View>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Generated by Pre-Lease Grid | {new Date().toLocaleDateString()}</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactText}>www.preleasegrid.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PropertyBrochure;
