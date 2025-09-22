using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.ViewModels.Pagination;
using Umbraco.Cms.Api.Management.Controllers.Media.Tree;
using Umbraco.Cms.Api.Management.Factories;
using Umbraco.Cms.Api.Management.Routing;
using Umbraco.Cms.Api.Management.Services.Entities;
using Umbraco.Cms.Api.Management.ViewModels.Tree;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Entities;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Web.Common.Authorization;

namespace Umbraco.Community.MediaReplacement.Services.Controllers
{

	[ApiController]
	[VersionedApiBackOfficeRoute($"{Constants.Web.RoutePath.Tree}/{Constants.UdiEntityType.Media}")]
	[ApiExplorerSettings(GroupName = nameof(Constants.UdiEntityType.Media))]
	[Authorize(Policy = AuthorizationPolicies.SectionAccessForMediaTree)]
	public class MediaFoldersController : MediaTreeControllerBase
	{
		private readonly IFilteredEntityService _filteredEntityService;
		
		public MediaFoldersController(
			IFilteredEntityService filteredEntityService,
			IEntityService entityService,
			IUserStartNodeEntitiesService userStartNodeEntitiesService,
			IDataTypeService dataTypeService,
			AppCaches appCaches,
			IBackOfficeSecurityAccessor backofficeSecurityAccessor,
			IMediaPresentationFactory mediaPresentationFactory)
			: base(entityService, userStartNodeEntitiesService, dataTypeService, appCaches, backofficeSecurityAccessor, mediaPresentationFactory)
		{
			_filteredEntityService = filteredEntityService;
		}

		[HttpGet("root/folders")]
		[MapToApiVersion("1.0")]
		[ProducesResponseType(typeof(PagedViewModel<MediaTreeItemResponseModel>), StatusCodes.Status200OK)]
		public async Task<ActionResult<PagedViewModel<MediaTreeItemResponseModel>>> Root(
			CancellationToken cancellationToken,
			int skip = 0,
			int take = 100,
			Guid? dataTypeId = null)
		{
			IgnoreUserStartNodesForDataType(dataTypeId);
			return await ChildMediaFolders(null, skip, take);
		}

		[HttpGet("folders")]
		[MapToApiVersion("1.0")]
		[ProducesResponseType(typeof(PagedViewModel<MediaTreeItemResponseModel>), StatusCodes.Status200OK)]
		public async Task<ActionResult<PagedViewModel<MediaTreeItemResponseModel>>> Children(
			CancellationToken cancellationToken,
			Guid parentId,
			int skip = 0,
			int take = 100,
			Guid? dataTypeId = null)
		{
			IgnoreUserStartNodesForDataType(dataTypeId);
			return await ChildMediaFolders(parentId, skip, take);
		}

		protected Task<ActionResult<PagedViewModel<MediaTreeItemResponseModel>>> ChildMediaFolders(Guid? parentId, int skip, int take)
		{
			IEntitySlim[] children = _filteredEntityService.GetPagedChildren(parentId, UmbracoObjectTypes.Media, skip, take, out var totalItems).ToArray();
			MediaTreeItemResponseModel[] treeItemViewModels = MapTreeItemViewModels(parentId, children);
			PagedViewModel<MediaTreeItemResponseModel> result = PagedViewModel(treeItemViewModels, totalItems);
			return Task.FromResult<ActionResult<PagedViewModel<MediaTreeItemResponseModel>>>(Ok(result));
		}
	}
}
