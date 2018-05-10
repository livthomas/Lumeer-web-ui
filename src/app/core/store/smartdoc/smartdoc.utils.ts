/*
 * Lumeer: Modern Data Definition and Processing Platform
 *
 * Copyright (C) since 2017 Answer Institute, s.r.o. and/or its affiliates.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {Dictionary} from '@ngrx/entity/src/models';
import {filterLinkTypesByCollection, getOtherLinkedCollectionId} from '../../../shared/utils/link-type.utils';
import {Perspective} from '../../../view/perspectives/perspective';
import {CollectionModel} from '../collections/collection.model';
import {LinkTypeModel} from '../link-types/link-type.model';
import {QueryModel} from '../navigation/query.model';
import {SmartDocConfig, SmartDocConfigPart, SmartDocCursor, SmartDocEmbeddedPart, SmartDocModel, SmartDocPart, SmartDocPartType, SmartDocTextPart} from './smartdoc.model';

export function findSmartDocByCursor(smartDoc: SmartDocModel, cursor: SmartDocCursor): SmartDocModel {
  if (cursor.partPath.length === 0) {
    return smartDoc;
  }

  const part = findSmartDocPartByPath(smartDoc, cursor.partPath);
  return (part as SmartDocEmbeddedPart).smartDoc;
}

export function findSmartDocPartByPath(smartDoc: SmartDocModel, partPath: number[]): SmartDocPart {
  if (!partPath || partPath.length === 0) {
    throw Error('Invalid smart document part path');
  }

  const part = smartDoc.parts[partPath[0]] as SmartDocEmbeddedPart;
  if (partPath.length === 1) {
    return part;
  }

  return findSmartDocPartByPath(part.smartDoc, partPath.slice(1));
}

export function smartDocConfigFollowsQuery(config: SmartDocConfig, query: QueryModel, linkTypesMap: Dictionary<LinkTypeModel>): boolean {
  const queryTree = createCollectionsTreeFromQuery(query, linkTypesMap);
  const configTree = createCollectionsTreeFromConfig(null, config, linkTypesMap);
  return equalCollectionTrees(queryTree, configTree);
}

interface CollectionNode {

  linkTypeId?: string;
  collectionId: string;
  children: CollectionNode[];

}

function createCollectionsTreeFromQuery(query: QueryModel, linkTypesMap: Dictionary<LinkTypeModel>): CollectionNode {
  const linkTypes: LinkTypeModel[] = query.linkTypeIds.map(linkTypeId => linkTypesMap[linkTypeId]);
  return createCollectionsTreeFromLinks(null, query.collectionIds[0], linkTypes);
}

function createCollectionsTreeFromLinks(linkTypeId: string, collectionId: string, unusedLinkTypes: LinkTypeModel[]): CollectionNode {
  const linkTypes = filterLinkTypesByCollection(unusedLinkTypes, collectionId);
  return {
    linkTypeId,
    collectionId,
    children: linkTypes.map(linkType => createCollectionsTreeFromLinks(
      linkType.id,
      getOtherLinkedCollectionId(linkType, collectionId),
      unusedLinkTypes.filter(linkType => !linkTypes.includes(linkType)))
    )
  };
}

function createCollectionsTreeFromConfig(linkTypeId: string, config: SmartDocConfig, linkTypesMap: Dictionary<LinkTypeModel>): CollectionNode {
  return {
    linkTypeId,
    collectionId: config.collectionId,
    children: config.parts.filter(part => part.type === SmartDocPartType.Embedded)
      .map(part => createCollectionsTreeFromConfigPart(config.collectionId, part, linkTypesMap))
  };
}

function createCollectionsTreeFromConfigPart(linkedCollectionId: string, part: SmartDocConfigPart, linkTypesMap: Dictionary<LinkTypeModel>): CollectionNode {
  if (part.perspective === Perspective.Table) {
    return {
      linkTypeId: part.linkTypeId,
      collectionId: getOtherLinkedCollectionId(linkTypesMap[part.linkTypeId], linkedCollectionId),
      children: []
    };
  }
  return createCollectionsTreeFromConfig(part.linkTypeId, part.smartDoc, linkTypesMap);
}

function equalCollectionTrees(tree1: CollectionNode, tree2: CollectionNode): boolean {
  if (tree1.collectionId !== tree2.collectionId || tree1.linkTypeId !== tree2.linkTypeId || tree1.children.length !== tree2.children.length) {
    return false;
  }

  const tree1Children = [...tree1.children].sort((a, b) => a.collectionId.localeCompare(b.collectionId));
  const tree2Children = [...tree2.children].sort((a, b) => a.collectionId.localeCompare(b.collectionId));

  const indexes = Array.from(Array(tree1Children.length).keys());
  return indexes.every(index => equalCollectionTrees(tree1Children[index], tree2Children[index]));
}

export function createSmartDocFromConfig(config: SmartDocConfig): SmartDocModel {
  return {
    collectionId: config.collectionId,
    parts: config.parts.map(part => createSmartDocPartFromConfig(part))
  };
}

function createSmartDocPartFromConfig(configPart: SmartDocConfigPart): SmartDocPart {
  if (configPart.type === SmartDocPartType.Embedded) {
    return new SmartDocEmbeddedPart(configPart.linkTypeId, configPart.perspective,
      configPart.smartDoc ? createSmartDocFromConfig(configPart.smartDoc) : null);
  }
  if (configPart.type === SmartDocPartType.Text) {
    return new SmartDocTextPart(configPart.textData); // TODO choose correct field
  }
  throw Error('Unknown smart document part type: ' + configPart);
}

export function createSmartDocFromQuery(query: QueryModel, collectionsMap: Dictionary<CollectionModel>, linkTypesMap: Dictionary<LinkTypeModel>): SmartDocModel {
  const collectionTree = createCollectionsTreeFromQuery(query, linkTypesMap);
  return createSmartDocFromCollectionTree(collectionTree, collectionsMap);
}

function createSmartDocFromCollectionTree(tree: CollectionNode, collectionsMap: Dictionary<CollectionModel>): SmartDocModel {
  const collection = collectionsMap[tree.collectionId];
  const textPart: SmartDocPart = new SmartDocTextPart('Attributes text table should be here'); // TODO generate attributes text table

  return {
    collectionId: collection.id,
    parts: [textPart].concat(tree.children.map(subtree => createSmartDocPartFromCollectionTree(subtree, collectionsMap)))
  };
}

function createSmartDocPartFromCollectionTree(tree: CollectionNode, collectionsMap: Dictionary<CollectionModel>): SmartDocPart {
  if (!tree.children.length) {
    new SmartDocEmbeddedPart(tree.linkTypeId, Perspective.Table);
  }

  const smartDoc = createSmartDocFromCollectionTree(tree, collectionsMap);
  return new SmartDocEmbeddedPart(tree.linkTypeId, Perspective.SmartDoc, smartDoc);
}
