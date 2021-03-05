export const hugeDoc = [
  {
    type: 'p',
    children: [
      {
        text:
          'The algorithm specified in this document is designed to derive footprint level canopy cover and vertical profile over vegetated areas between ~52°N and ~52°S.\nThe data product includes estimates of total canopy cover and PAI, vertical profiles of canopy cover and PAI, the vertical profile of Plant Area Volume Density and foliage height diversity. The GEDI Level 2A and 2B products will provide unprecedented dense spatial samplings of forest structure globally.'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text:
          'Canopy cover is a biophysical parameter widely used in terrestrial remote sensing to describe the spatially aggregated geometric properties of vegetation. Multiple definitions of canopy cover exist, depending on the applied measuring techniques.'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'The central issues in the definition are:'
      }
    ]
  },
  {
    type: 'ol',
    children: [
      {
        type: 'li',
        children: [
          {
            type: 'p',
            children: [
              {
                text:
                  'whether the measurement is acquired at a specific viewing angle (mostly near-nadir) or over the entire hemisphere;'
              }
            ]
          }
        ]
      },
      {
        type: 'li',
        children: [
          {
            type: 'p',
            children: [
              {
                text:
                  'whether a tree crown is treated as an opaque object including all small within-canopy gaps.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text:
          'In contrast to traditional passive optical sensors, lidar systems measure the forest mostly at a small zenith-viewing angle. An off-nadir angle of discrete return airborne lidar is typically < 15° and it is < 6° for GEDI to avoid inaccurate range measurements. While airborne lidar can help delineate individual tree crown with high spatial resolution and footprint density (i.e. counting small openings as part of tree cover), large footprint waveform lidar systems like GEDI can only provide estimates of canopy fractional cover over the laser-illuminated area. Thus, the GEDI derived canopy cover is the percent of the ground covered by the vertical projection of canopy material (i.e. leaves, branches and stems only).'
      }
    ]
  },
  {
    type: 'sub-section',
    children: [
      {
        text: 'Canopy cover types'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'It is different from two other widely used cover types: '
      }
    ]
  },
  {
    type: 'ul',
    children: [
      {
        type: 'li',
        children: [
          {
            type: 'p',
            children: [
              {
                text:
                  'canopy closure defined as "the proportion of the vegetation over a segment of the sky hemisphere at one point on the ground”'
              }
            ]
          }
        ]
      },
      {
        type: 'li',
        children: [
          {
            type: 'p',
            children: [
              {
                text:
                  'crown cover as "the percentage of the ground covered by a vertical projection of the outermost perimeter of the natural spread of the foliage of plants".'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text:
          'The canopy cover profile is the horizontally-intercepted canopy elements at a given height, and is calculated as one minus gap distribution at that height level.'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text:
          "FHD measures the complexity of canopy structure. It is also known as Shannon's diversity index, the Shannon-Wiener index, or the Shannon entropy in the ecological literature, and it was originally proposed to quantify the entropy (uncertainty or information level) in information theory.\nA high FHD value in forest ecology often results from more complex forests structure. This complexity is a good indicator of habitat quality for wild life, as suggested by pioneering studies of MacArthur & Horn (1961). In particular, biodiversity patterns of birds are widely studied in the context of vegetation structure. Recent developments of lidar remote sensing have promised an enhanced measurement capability of FHD that was previously limited at a few plot samplings due to high labor cost. Since FHD measurement is largely based on estimates of vertical LAI profile, it can also be directly derived from GEDI."
      }
    ]
  }
];
